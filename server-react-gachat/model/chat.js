// 聊天室表模型
const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    // 用于标识 a 与 b 聊天 或者 b 与 a聊天 其实是同一个表
    'chat_id': {'type': String, 'required': true},
    // 聊天人头像
    // 'chat_avatar': {'type':String},
    // 信息
    "message": [
        {
            // 发送人
            "from": {'type': String, 'required': true},
            // 接收人
            'to':   {"type": String, 'required': true},
            // 创建时间
            'create_time': {'type': Number, 'default': Date.now},
            // 是否已读
            'read': {'type': Boolean, 'default': false},
            // 聊天记录
            'msg': {'type': String},
            // 标记未读数量 只有在获取首页聊天内容才需要
            'unreadLen': {type: Number},
            // 用于存放用户信息
            'user_msg': {'type': Object},
        }
    ]
})

module.exports = mongoose.model('Chat', chatSchema)