// const io = require('../app')

const express = require('express')
const router  = express.Router()
// const io = require('socket.io')
const User    = require('./../model/user')
const Chat    = require('../model/chat')

const resMsg  = require('../common/resMsg')
const error   = resMsg.error
const success = resMsg.success

const md5     = require('md5')
// 过滤不必要字段
const _filter = {'__v': 0,'password': 0, friend: 0}
const _friendFilter = {'__v': 0,'password': 0, friend: 0, friend_req: 0}
// 初始化数据
const initData = {

}

/***
 * 注册账户
 * nickName 用户名
 * phone    手机
 * avatar   头像
 */

router.post('/register', (req, res) => {
    let {nickName, phone, password} = req.body
    if (nickName && phone && password) {
        User.findOne({phone}, (err, doc) => {
            if (err) {
                res.json(error(err))
            } else {
                if (doc) {
                    res.json(error('手机号码已经存在'))
                } else {
                    const userModel = new User({nickName, phone, password: md5(password)})
                    userModel.save((err2, doc2) => {
                        if (err2) {

                            res.json(error(err2))

                        } else {


                            const {nickName, phone, _id, avatar} = doc2

                            res.cookie('token', _id, {maxAge: 60 * 60 * 6 * 1000})
                            res.json(success({nickName, phone, _id, avatar}
                            ))
                        }
                    })
                }
            }
        })
    } else {
        res.json(error('缺少必须参数'))
    }
})

/***
 * 登陆 todo
 */
router.post('/login', (req, res) => {
    let {phone, password} = req.body
    if (phone && password) {
        User.findOne({phone}, {friend: 0, '__v': 0}, (err, doc) => {
            if (err) {
                res.json(error(err.message))
            } else {
                if (doc) {
                    if ( md5(password) !== doc.password) {
                        res.json(error('密码错误!'))
                    } else {

                        // 设置cookie 6 小时过期
                        res.cookie('token', doc._id,  {maxAge: 60 * 60 * 6 * 1000})

                        // 后期需要返回最后一条信息 todo
                        const requestList = doc.friend_req.filter(v=> {
                            return !v.read && v.req_status === 1
                        })

                        const requestLen  = requestList.length
                        let   requestLast = {}
                        if (requestLen) {
                            // 第一条数据 todo 后期获取第一条信息
                            requestLast = requestList[0]
                        }
                        const {phone , avatar, _id, nickName, desc} = doc

                        res.json(success({
                            phone,
                            avatar,
                            _id,
                            desc,
                            nickName,
                            requestFriendMsg: {requestLast, requestLen}
                        }))


                    }
                } else {
                    res.json(error('用户不存在'))
                }
            }
        })
    } else {
        res.json(error('账号密码不能为空!'))
    }
})

// 获取用户信息
router.get('/info', (req, res) => {
    console.log('info-----');
    const { token } = req.cookies
    if (!token) return res.json(error('用户信息过期,请重新登陆'))
    User.findOne({_id: token}, _filter, async (err, doc) => {
        if (err) {
            res.json(error(err.message))
        } else {


            // 好友请求信息
            const requestList = doc.friend_req.filter(v=> {
                return !v.read && v.req_status === 1
            })

            // 未读长度
            const requestLen  = requestList.length

            // 第一条数据占坑 todo 后期需要获取第一条信息
            let   requestLast = requestLen ? requestList[0]:{}

            const {phone , avatar, _id, nickName, desc} = doc

            // 首次返回未读信息条数 => 规则: 找到 chat_id 包含自己的 并且form不为自己的 并且 read 为 false的
            let unreadMsgLen = 0
            await Chat.find({}, (e, d)=>{
                d.forEach((item) => {
                    // 找到符合条件的 计算条数
                    if (item.chat_id.includes(token)) {
                        unreadMsgLen += item.message.filter(
                            value=>(value.from !== token && !value.read)
                        ).length
                    }
                })
            })

            res.json(success({
                phone,
                avatar,
                _id,
                desc,
                nickName,
                requestFriendMsg: {requestLast, requestLen},
                unreadMsgLen
            }))

        }
    })
})

// 获取聊天列表 => 有聊天记录 => 按照时间排序返回 最后一条记录 未读条数
router.post('/chatList', async (req, res)=> {
    const {token} = req.cookies
    // let unreadMsgLen = 0
    const chatList = []
    // 聊天对象
    const toId = []
    await Chat.find({}, (e, d) => {
        // 表里没任何聊天记录
        if (!d.length) return
        d.forEach((item) => {
            // 找到符合条件的 => 排序 按照最后条聊天时间
            if (item.chat_id.includes(token)) {
                // 没聊天内容
                if (!item.message.length) return

                const message = item.message
                // 未读条数
                const unreadLen = message.filter(v=>(v.from !== token && !v.read)).length

                const last = message[message.length -1]

                // 未读条数
                last['unreadLen'] = unreadLen
                // 保存数据
                chatList.push(last)

                // 是否来自自己
                toId.push(last.from === token ? last.to : last.from)

            }
        })
    })

    if (chatList.length) {
        // 查找对方信息
        await User.find({_id:{$in: toId}}, _friendFilter, (e, d) => {
                chatList.forEach((item, i) => {
                    let indexId = item.from === token ? item.to : item.from
                    // 拼接数据
                    chatList[i]['user_msg'] = d.filter(v=>(v._id == indexId))[0]
                })
        })

        // 降序排序 todo 需要限制返回条数
        chatList.sort((a, b) => {
            return  b.create_time - a.create_time
        })

        res.json(success(chatList))
    } else {

        res.json(success([], '没找到任何聊天记录'))

    }

})


// 获取查询用户信息
router.get('/detInfo', (req, res) => {
    const {phone} = req.query
    const {token} = req.cookies
    // 标识是否好友
    let  isFriend = false
    // 先查询用户名下是否有该用户 有就是朋友
    User.findOne({_id: token}, (err, doc)=> {
        const {friend} = doc
        if (friend.length) {
            // 有好友
            for (let item of friend) {
                const friendId = item.phone
                if (friendId === phone) {
                    // 是好友
                    isFriend = true
                    break
                }
            }
        }
        User.findOne({phone}, {friend: 0, password: 0, friend_req: 0}, (err1, doc1) => {
            if (err1) {
                res.json(error(err1))
            }
            if (doc1) {
                doc1._doc.isFriend = isFriend
                res.json(success(doc1))
            } else {
                res.json(error('用户不存在'))
            }
        })
    })



})


// 获取通讯录
router.get('/friend', (req, res) => {
    if (req.cookies.token) {
        User.findOne({_id: req.cookies.token},(err, doc) => {
            if (err) {
                res.json(error(err.message))
            } else {
                const {friend}  = doc
                if (friend.length) {
                    // 取得phone
                    const friendListPhone = friend.map((item, i)=>{
                            return item.phone
                        })
                    User.find({phone: {$in: friendListPhone}},_friendFilter, (err1, doc1)=>{
                        res.json(success(doc1))
                    })
                }else {
                    res.json(success([]))
                }
            }
        })
    } else {
        res.json(error('用户未登录'))
    }
})

// 获取好友请求列表 todo
router.get('/friendList', (req, res) => {
    if (req.cookies.token) {
        // 查询当前用户
        User.findOne({_id: req.cookies.token},(err, doc) => {
            if (err) {
                res.json(error(err.message))
            } else {
                // 请求列表
                const {friend_req}  = doc
                // 复制数组
                if (friend_req.length) {
                    const reqIdList = []
                    for (let item of friend_req) {
                        reqIdList.push(item.req_id)
                    }
                    // 查找id todo 排序
                   let FriendListModel = User.find(
                        {phone: {$in: reqIdList}},
                        _friendFilter,
                        (err1, doc1) => {

                            // 拼接对方信息
                            friend_req.forEach((item, i)=>{
                                    doc1.forEach((item2, j) => {
                                        if (item.req_id === item2.phone) {
                                            console.log(11111)
                                            item['user_msg'] = item2
                                        }
                                    })
                            })

                            console.log(friend_req)

                            res.json(success(friend_req))
                        })


                } else {
                    res.json(success([], '并没有人想添加你为好友'))
                }

            }
        })
    } else {
        res.json(error('用户未登录'))
    }
})

/***
 * 读取信息
 * type =>
 * friendReq 读取好友请求
 * chatMsg   读取聊天记录 需要 from to
 */

router.post('/readMsg', async (req, res) => {
    const {type, to, from} = req.body
    if (type) {

        // 读取好友请求
        if (type === 'friendReq') {
           await User.findById(req.cookies.token,(err, doc) => {
                const {friend_req} = doc
                if (friend_req.length) {
                    friend_req.forEach(v=>{
                        v.read = true
                    })
                    doc.save((e,d)=>{
                        res.json(success('','信息读取成功'))
                    })
                }else {
                    res.json(success('','没有好友请求请求'))
                }
            })
            return

        }
        // 读取聊天记录
        if (type === 'chatMsg' && to && from) {
            const chat_id = [to, from].sort().join('_')
            const me = req.cookies.token
            Chat.findOne({chat_id}, (err, doc) => {
                if (doc) {
                    const {message} = doc
                    if (message && message.length) {
                        message.forEach(item=>{
                            // 将对方的信息都设置为已读

                            if (item.from !== me) {
                                item.read = true
                            }
                        })
                        doc.save((e, d) => {
                            res.json(success('', '读取成功'))
                        })

                    } else {
                        res.json(success('','聊天内容为空'))
                    }
                } else {
                    res.json(success('','没聊天内容'))
                }
            })

        } else {
            res.json(error('缺少必须参数'))
        }


    } else {
        res.json(error('缺少必须参数'))
    }

})


/***
 * 申请添加好友 todo
 * phone        对方phone
 * req_desc     请求描述
 * user_phone   我的phone
 */

router.post('/addFried', (req, res) => {
    const {phone, req_desc, user_phone} = req.body
    const {token} = req.cookies
    if (token) {
        // 先默认不是好友
        User.findOne({phone}, (err, doc)=> {
            if (err) {
                res.json(error(err.message))
            } else {
                if (doc) {
                    const newFeiendReq = {
                        req_id: user_phone,
                        req_desc: req_desc,
                        req_time: Date.now(),
                        read: false
                    }
                    // 有好友请求 查询是否已经请求了 更新请求时间调换顺序
                    if (doc.friend_req.length) {
                        const index = doc.friend_req.findIndex(value => {
                            return value.req_id == user_phone
                        })
                        if (index > -1) {
                            doc.friend_req.splice(index, 1)
                            doc.friend_req.unshift(newFeiendReq)
                            doc.save((e,d)=>{
                                res.json(success('', '发送验证成功'))
                            })
                        } else {
                            // 添加请求
                            doc.friend_req.unshift(newFeiendReq)
                            // 保存数据库 并推送消息到对应用户
                            doc.save((e, d)=> {
                                res.json(success('', '发送验证成功'))
                            })
                        }
                    }else {
                        console.log('没条数')
                        // 添加请求
                        doc.friend_req.unshift(newFeiendReq)
                        // 保存数据库 并推送消息到对应用户
                        doc.save((e, d)=> {
                            res.json(success('', '发送验证成功'))
                        })
                    }


                } else {
                    res.json(error('发送验证失败, 用户未找到'))
                }
            }

        })
    }

})


// 通过验证 todo
router.post('/byVerify',  (req, res) => {
    const {phone} = req.body
    // 查询是否发送了好友请求
    User.findOne({_id: req.cookies.token}, async (err, doc) => {
        let reqList = []
        for (let item of doc.friend_req) {
            reqList.push(item.req_id)
        }
        if (reqList.includes(+phone)) {
            // 更新状态
            await User.update(
                {   '_id':req.cookies.token,
                    'friend_req.req_id': phone},
                {   'friend_req.$.req_status': 0,
                    'friend.$.phone': phone,
                    'friend.$.remark': ''
                },
                // 没有就新增
                {upsert: true}, (err1)=> {
                if (err1) {
                    res.json(error(err1.message))
                }
            })
            await User.findOne({'phone': phone}, (err2, doc2)=> {
                doc2.friend.unshift({
                    phone : doc.phone,
                    remark: ''
                })
                doc2.save((e, d)=>{
                    res.json(success('', '通过成功'))
                })
            })


        } else {
            res.json(error('都还没先发送好友验证呢~~'))
        }
    })
})





/***
 * 获取首次聊天记录
 * from 我的id
 * to   别人的id
 */
router.post('/chatRec', async (req, res) => {
    // from 先拿cookie
    const {to} = req.body
    const from = req.cookies.token
    const chat_id = [from, to].sort().join('_')
    // 对方信息
    let   user_msg = null
    await User.findById({_id: to}, _friendFilter, (err, doc)=> {
        if (err) {
            console.log(err.message)
        } else {
            user_msg = doc
        }
    })
    if (from && to) {
        await Chat.findOne({chat_id}, (err, doc) => {
            if (err) {
                res.json(error(err.message))
            } else {
                if (doc) {
                    console.log(user_msg)
                    res.json({user_msg,code: 0, msg: '',data:doc.message})
                } else {
                    res.json(success([],'聊天记录为空'))
                }
            }
        })
    }else {
        res.json(error('缺少参数'))
    }
})




module.exports = router