// 拿到Book创建表规则
let BookSchema = require('../Schema/BookSchema')

// 拿到mongoose 
let { db } = require('../Schema/config')

module.exports = db.model('Book',BookSchema)