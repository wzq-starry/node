// 引入Schema
// 建立书名简介的规则
let Schema = require('./config').Schema

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['玄幻', '言情', '都市', '军事', '武侠', '仙侠', '历史'],
        required: true
    },
    author: {
        type: String,
        required: true
    },
    synopsis: {
        type: String,
        required: true
    }
}, { versionKey: false })
