let Book = require('../Models/Book')
let Chapter = require('../Models/Chapter')

module.exports = async ctx => {
    let { id } = ctx.query

    // 基于小说的id查找 小说简介数据和小说所有章节
    let bookInfo = await Book.find({ _id: id })
    // 小说所有章节
    let chapterList = await Chapter.find({ book: id }, { content: 0 })
    await ctx.render('catalog.pug', {
        bookInfo,
        chapterList,
    })
}