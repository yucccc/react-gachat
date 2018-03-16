const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // 用户名
    "nickName": String,
    // 密码
    "password": String,
    // 个人头像    默认一个七牛云头像
    "avatar":   {'type': String, 'default':'http://oui1uvcx0.bkt.clouddn.com/default-man.jpg'},
    // 朋友圈封面图 默认一个七牛云地址
    "album":    {'type': String, default: ''},
    // 个性签名
    "desc":     {'type': String, 'default':''},
    // 手机号
    "phone":    Number,
    // 好友请求列表
    "friend_req":[
        {
            // 请求时间 根据时间计算过期
            'req_time': {'type': Number, 'default': Date.now},
            // 请求phone  根据id查一次数据库
            'req_id': {'type': Number, 'required': true},
            // 请求状态 0 已添加 1 等待添加 2 已过期
            'req_status': {'type': Number, 'default': 1, 'required': true},
            // 请求描述
            'req_desc': {'type': String, 'default': '请求添加你为好友'},
            // 用于存放用户信息 不然合并不了数据
            'user_msg': {},
            // 该验证是否已读 用于统计未读条数
            'read': {'type': Boolean, 'default': false, }
        }
    ],
    // 通讯录列表
    "friend":   [
        {
            // 注册时尬聊号 账号标识 目前是唯一的
            "phone":    {'type': String, 'required': true},
            // 备注名
            "remark":   {'type': String, 'default': ''}
        }
    ]
})

module.exports = mongoose.model('User', userSchema)