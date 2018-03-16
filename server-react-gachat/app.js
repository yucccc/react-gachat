
import csshook from 'css-modules-require-hook/preset'
import assethook   from 'asset-require-hook'

assethook({
    extensions: ['png', 'svg']
})

import express      from 'express';
import React from 'react';
import { renderToString } from "react-dom/server";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose} from 'redux'
import { StaticRouter }           from 'react-router-dom'
import thunk        from 'redux-thunk'
import reducers     from './../src/reducer'

import App          from './../src/app'
import fs           from 'fs'


const bodyParser    = require('body-parser')
const cookieParser  = require('cookie-parser')

const app   = express()
const user  = require('./router/user')
const index = require('./router/index')
const moments = require('./router/moments')

// 1. 写provier 
// 2. app

const store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk)
    )
);

const Chat  = require('./model/chat')
const User  = require('./model/user')
const http  = require('http').Server(app);
const io    = require('socket.io')(http);

const path  = require('path');



const _friendFilter = {'__v': 0,'password': 0, friend: 0, friend_req: 0}
// 保存已经连接的用户
const onlineUsers = {};
let   userid = ''
// io 连接 todo
io.on('connection', function (socket) {
    console.log(`io 连接成功 你的id为: ${socket.id}`);
    // 保存服务端id
    const socketId = socket.id
    // 客户端连接
    socket.on('loginSocket',function (userId) {
        if (!userId) return
        userid = userId
        // 保存在线用户id
        onlineUsers[userId] = socketId
    });
    // 当前连接的用户信息
    console.log('onlineUsers',onlineUsers)

    // 监听到发送的消息
    socket.on('sendMsg', (data) => {
        const {from, to, msg} = data
        const chat_id = [from, to].sort().join('_')
        const chatData = {to, from, msg}
        // 查找对应聊天
        Chat.findOne({chat_id}, async (err, doc) => {
            // 
            let user_msg = null

            await User.findById(from, _friendFilter, (e, d) => {
                user_msg = d
            })
            // 有聊天内容
            if (doc) {
                doc.message.push(chatData)
                doc.save((err2, doc2) => {
                    // 先返回信息的最后一条 可能存在两人同时发送信息 另外一个先保存了
                    // const data = Object.assign({}, doc2._doc)
                    const data = doc2.message[doc2.message.length-1]

                    console.log('data',data)
                    // console.log(doc2[doc2.length-1])
                    // 在线
                    if (onlineUsers[to]) {
                        // 推给另外一个人
                        io.to(onlineUsers[to]).emit('receiveMsg', {data, user_msg})
                    }
                    // 推送给自己
                    io.to(socketId).emit('receiveMsg',  {data, user_msg})
                 })

            } else {

                // from -> to  没有任何聊天记录 这种情况下只需要考虑对方发的 因为我发的是可以拿到对方信息
                // 所以需要顺便返回对方的信息 用于聊天列表显示

                await Chat.create({chat_id, message: [chatData]}, (err1, doc1) => {
                    const data = doc1.message[0]
                    if (onlineUsers[to]) {
                        // 推给对方
                        io.to(onlineUsers[to]).emit('receiveMsg',  {data, user_msg})
                    }
                    // 推送给自己
                    io.to(socketId).emit('receiveMsg',  {data, user_msg})
                })



            }
        })

    })

    // 好友请求 接收要发送的 id
    socket.on('addFriendRequest', async (toId) => {
        if (!toId && !onlineUsers[toId]) return
            // 在线就发给对方
            User.findOne({_id: toId}, (err, doc )=> {
               let len = 0
                // 有内容 并且未读
               if (doc && doc.friend_req.length) {
                   // 读取等待通过的条数
                   len = doc.friend_req.filter(v => (!v.read && v.req_status === 1)).length
               }
                // 返回对方请求提条数
                io.to(onlineUsers[toId]).emit(
                    'monitorFriendReq',
                    // 请求条数
                    len
                )

            })

    })

});



// 格式化表单数据
app.use(bodyParser.json())
// 限制允许提交的大小
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}))
// 处理错误
app.use( (err, req, res, next) =>{
    res.status(404).json({message: err.message})
})
// cookie
app.use(cookieParser())
app.use((req, res, next) => {
    if (req.url.startsWith('/user/') || req.url.startsWith('/moments/') || req.url.startsWith('/static/')) {
        return next()
    }
    let context = {}
    // renderToString 前端代码
    const markup = renderToString((
        <Provider store={store}>
            <StaticRouter
                location={req.url}
                context={context}
                >
                <App/>
            </StaticRouter>
        </Provider>
    ))
    const template = fs.readFileSync(path.join(__dirname, '../build/index.html'), 'utf8')

    // return res.sendFile(path.resolve('build/index.html'))
    res.send(template.replace('<!-- app -->', markup))
})
// ***
app.use('/', express.static(path.resolve('build')))

// app.use('/', index)
app.use('/user', user)
app.use('/moments', moments)
 

http.listen(3002, function () {
    console.log('服务器已经启动');
})

