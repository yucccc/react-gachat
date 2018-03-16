const express     = require('express')
const router      = express.Router()
const mongoose    = require('mongoose')
const db          = mongoose.connection
// 解决警告
mongoose.Promise  = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/chat', {useMongoClient: true})

db.once("open", () => {
    console.log("数据库连接成功");
})

db.on("error", (error) => {
    console.log("数据库连接失败：" + error);
})

db.on('disconnected', () => {
    console.log('数据库连接断开');
})

/* GET Home page. */
router.get('/', (req, res) => {
    res.send('<h1>欢迎来到尬聊！</h1>');
});

module.exports = router;
