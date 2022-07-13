// 引入Schema
// 建立章节的规则 
let Schema = require('./config').Schema

module.exports = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }
}, { versionKey: false })