const mongoose = require('mongoose')

// 以 _id 作为关联
const momentsSchema = new mongoose.Schema({
    //  用户id
    user_id: {'type': String, 'required': true},
    // 发布时间
    create_time: {'type': Number, 'default': Date.now},
    // 所有人可见 0 自己可见 1 部分可见 2 后期做 占坑
    auth: {'type': Number, 'default': 0},
    // 此条朋友圈的描述
    desc: {'type': String, 'default': ''},
    // 此条朋友圈图片列表
    moments_img: [
        {
            // 图片地址 后期可能有缩略图 点击大图之分 先大图小图一样
            smallImg: {'type': String},
            bigImg: {'type': String},
            id: {'type': Number}
        }
    ],
    // 点赞
    like: [
        {
            // 用户 id
            likeId: {'type': String}
        }
    ],
    // 评论内容 先不做
    comment: []
})


module.exports = mongoose.model('Moment', momentsSchema)