const Book = require('../Models/Book')


module.exports = async ctx => {
  // 查询条件：type ? || search ?  分页信息数据：limit ?  page ?
  // get请求参数：ctx.query  ctx.querystring  没有其他额外操作
  // post：koa-body模块挂在到app上处理post请求，从而才能取到数据 ctx.request.body


  let {type, search, limit, page} = ctx.query
  // 过滤page 没传或者传了但是小于1时，默认设为之1
  page = (page && page > 0 && page) || 1
  limit = (limit && limit > 0 && limit) || 5
  

  let data = []
  let url = `/?limit=${limit}`
  // 判断search 区别是通过首页的搜索框进行查询的，可以直接点击分类的导航进行查询的
  if (search) {
    // 搜索框  模糊查询
    data = await Book.find({
      $or: [
        {
          name: {
            $regex: new RegExp(search, 'i') 
          }
        }
      ]
    }, {synopsis: 0}).limit(limit*1).skip(limit * (page - 1))

    url += `&search=${search}&page=`
  }else{
    // 导航
    type = type || '玄幻'
    data = await Book.find({type}, {synopsis: 0}).limit(limit*1).skip(limit * (page - 1))
    url += `&type=${type}&page=`
  }
  
  
  await ctx.render('index.pug', {
    books: data,
    url,
    page
  })
}