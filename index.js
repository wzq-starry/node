const Koa = require('koa')
const app = new Koa
const views = require('koa-views')
const path = require('path')
const router = require('./routes')

app.use(views(
  path.join(__dirname, 'views')
))




app.use(router.routes())
app.listen(3000)