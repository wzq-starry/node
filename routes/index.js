let router = require('koa-router')()
let sendIndex = require('./sendIndex')
let sendCatalog = require('./sendCatalog')
let sendRead = require('./sendRead')
// 首页
router.get('/', sendIndex)

// 章节列表
router.get('/catalog', sendCatalog)

// 阅读接口
router.get('/read', sendRead)

module.exports = router