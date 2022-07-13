let Book = require('../Models/Book')
let Chapter = require('../Models/Chapter')
module.exports = async ctx => {
    let { id, bid } = ctx.query
    let book = ''
    try {
        book = await Chapter.find({ _id: id }).populate('book')
    } catch (error) {
        
    }
    // 拿到上一章的id
    let prevId = ''
    try {
        let prevData = await Chapter.find({
            _id: {
                $lt: id
            },
            book: bid
        }, null, {
            sort: {
                _id: -1
            },
            limit: 1
        }).populate('book')
        prevId = prevData[0]._id
    } catch (error) {

    }
    let nextId = ''
    // 拿到下一章的id
    try {
        let nextData = await Chapter.find({
            _id: {
                $gt: id
            },
            book: bid
        }, null, {
            limit: 1
        }).populate('book')
        nextId = nextData[0]._id
    } catch (error) {

    }

    await ctx.render('read.pug', {
        book,
        bid,
        prevId,
        nextId
    })
}