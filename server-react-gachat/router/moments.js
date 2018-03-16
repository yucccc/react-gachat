// 朋友圈
const express = require('express')
const router = express.Router()
const fs = require('fs')
const qn = require('qn')
const resMsg = require('./../common/resMsg')
const MomentsModel = require('./../model/moments.model')
const error = resMsg.error
const success = resMsg.success
// 空间名
const bucket = 'moments-img'
// 七牛云
const client = qn.create({
    //  空间名
    bucket,
    // 秘钥
    accessKey: 'n83SaVzVtzNbZvGCz0gWsWPgpERKp0oK4BtvXS-Y',
    secretKey: '1Uve9T2_gQX9pDY0BFJCa1RM_isy9rNjfC4XVliW',
    // 外链地址 仅供测试使用 限单 IP 访问频率，限速
    origin: 'http://p063uchzs.bkt.clouddn.com'
})

/***
 * 发送朋友圈
 */

router.post('/sendMoments', async (req, res) => {
    const {token} = req.cookies
    if (!token) {
        res.json(error('登陆已过期'))
        return
    }

    const {desc, imgData} = req.body
    const jsonImg = imgData && JSON.parse(imgData)
    if (!desc && !jsonImg.length) {
        res.json(error('发送内容不能为空!!'))
        return
    }
    // 构建朋友圈图片
    let filePaths = []
    // 批量上传七牛云
    let qiniuUpload = (filePaths) => {
        // map()方法返回新的 promise对象数组，
        // 若使用forEach()，报错：Cannot read property 'Symbol(Symbol.iterator)' of undefined
        // 因为没有返回值，运行到 return Promise.all(qiniuPromise) 时会返回 undefinded
        let qiniuPromise = filePaths.map(item => {
            // key 为上传到七牛云后自定义图片的名称
            return new Promise((resolve, reject) => {
                let {fileName, filePath} = item
                client.uploadFile(filePath, {key: `/moments/${fileName}`}, (err, result) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        console.log(result)
                        resolve(result);
                    }
                    // 上传之后删除本地文件
                    fs.unlinkSync(filePath);
                });

            });
        });

        return Promise.all(qiniuPromise);
    };


    if (jsonImg && jsonImg.length) {
        for (let item of jsonImg) {
            // 构建图片名字 保证唯一性
            let fileName = `${Date.now()}-${item.name}`
            // 构建图片路径
            let filePath = `./moments-images/${fileName}`
            // 过滤data:URL
            let base64Data = item.url.replace(/^data:image\/\w+;base64,/, "");
            let dataBuffer = new Buffer(base64Data, 'base64');

            // 写入文件
            await fs.writeFile(filePath, dataBuffer, (err) => {
                if (err) {
                    // 终结
                    res.end(JSON.stringify(error('写入文件失败')));
                } else {
                    filePaths.push({filePath, fileName})
                    // 写入七牛
                    if (filePaths.length === jsonImg.length) {
                        qiniuUpload(filePaths).then(result => {
                            const moments_img = result.map(item => ({url: item.url}))
                            // 保存数据库
                            const momentMod = new MomentsModel({
                                desc,
                                moments_img,
                                user_id: token
                            })
                            momentMod.save((e, d) => {
                                // 返回数据
                                res.json(success(d, '发表成功'))

                            })
                        })
                    }
                }

            })
        }

    } else {
        res.json(success({desc, moments_img}))
    }


})


module.exports = router