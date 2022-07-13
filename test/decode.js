const iconv = require('iconv-lite')

module.exports = (stream, encoding) => new Promise((r, j) => {
  let streamArray = []
  stream.on('data', chunk => {
    streamArray.push(chunk)
  })

  stream.on('end', chunk => {
    // 完成了
    let bufferData = Buffer.concat(streamArray)
    let res = iconv.decode(bufferData, encoding)
    r(res)
  })
  
  stream.on('error', err => {
    j(err)
  })
})