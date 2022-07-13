let mongoose = require('mongoose')
// 配置里面的变量
let ip = 'localhost'
let port = 3334
let database = 'story'

// 将上面的变量拼接

mongoose.connect(`mongodb://${ip}:${port}/${database}`).then(res => {
    console.log(`数据库连接成功,本地地址:${ip},端口:${port},目标地址:${database}`)
}).catch(console.log)

module.exports = {
    db: mongoose,
    Schema: mongoose.Schema
}