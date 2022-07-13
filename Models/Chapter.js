// 拿到Chapter创建表规则
let ChapterSchema = require('../Schema/ChapterSchema')

// 拿到mongoose 
let { db } = require('../Schema/config')

module.exports = db.model('Chapter',ChapterSchema)