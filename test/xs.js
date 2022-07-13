// 小说爬虫 --爬取数据
// 引入axios
let axios = require('axios')
let cheerio = require('cheerio')
let delay = require('delay') // 让程序等待某一段时间  延迟
let fs = require('fs')
let decode = require('./decode')
let Book = require('../Models/Book')
let Chapter = require('../Models/Chapter')

// 给axios加入默认配置
axios.defaults.baseURL = 'http://www.530p.com'
axios.defaults.method = 'get'
axios.defaults.responseType = 'stream'

let option = {
    'xuanhuan': '玄幻',
    'yanqing': '言情',
    'dushi': '都市',
    'junshi': '军事',
    'wuxia': '武侠',
    'xianxia': '仙侠',
    'lishi': '历史'
}

// 确保前端请求拿到的HTML页面，如果没有拿到，返回false
let getHTML = async url => {
    let count = 0 // 记录任意章节请求失败的次数。 >= 5  抛弃

    const f = async url => {
        let res = await axios(url).then(r => decode(r.data, 'gbk')).catch(err => err.message)

        if (/<\/html>/.test(res)) {
            // 请求成功
            return res
        } else {
            // 请求失败
            count++
            if (count > 5) {
                // 放弃  不要了
                fs.appendFileSync('./download.log', `${url} 下载失败 请检查`)
                return false
            } else {
                // 如果有章节请求失败，但是没有重试超过5次，等待500毫秒后 重试
                await delay(500)
                return await f(url)
            }
        }
    }

    return await f(url)
}
// 解析简介

let parseBook = htmlText => {
    let $ = cheerio.load(htmlText)
    let name = $('.tna a').text()
    let author = $('.tc').eq(0).text()
    let type = $('.tc').eq(1).text()
    let synopsis = $('tbody:eq(0)').find('tr:nth-child(4) > td:nth-child(1)').text().replace('【内容简介】', '').trim()
    return {
        name,
        author,
        type,
        synopsis
    }
}
// 目录url
let parseChaURL = htmlText => {
    let $ = cheerio.load(htmlText)
    let list = []
    $('.clc a').each((i, a) => {
        list.push(
            {
                index: i,
                url: $(a).prop('href')
            }
        )
    })
    return list
}
// 内容
let parseChapter = html => {
    let $ = cheerio.load(html)

    let title = $('#cps_title h1').text().trim()

    let content = $('#cp_content').text()

    return {
        title,
        content
    }
}
let run = async () => {
    let list = []
    for (let key in option) {
        // 请求首页 拿到不同分类的第一页的小说的url
        for (var i = 1; i < 2; i++) {
            // i分页的页数
            let htmlText = await getHTML(`/${key}/${i}.htm`)
            if (!htmlText) {
                // 请求失败
                continue;
            }
            // 将他变成jQuery对象
            let $ = cheerio.load(htmlText)
            $('.conter1 a').each((index, a) => {
                if (index > 10) return
                list.push(
                    {
                        url: $(a).prop('href'),
                    }
                )
            })
        }
    }
    // 循环list item是每一个小说的目录链接
    for (let item of list) {
        let htmlText = await getHTML(item.url)
        if (!htmlText) {
            continue
        }
        let bookInfo = parseBook(htmlText)
        // 记录当前写入数据库的书名的id  用于后续存储这本小说对应的章节内容时使用
        let id = ""
        try {
            id = await new Book(bookInfo).save().then(data => data._id)
            console.log(`${bookInfo.name} 书名写入完成`)
        } catch (error) {
            fs.appendFileSync('./log.txt', `[105] ${bookInfo.name} 书名写入失败，${error.message}`)
        }
        // 请求当前解析item.url对应的书籍的前20章的内容的url
        let chapterList = parseChaURL(htmlText)
        // 任意一本书的所有的章节目录的url
        for (let i = 0; i < 20; i++) {
            let item = chapterList[i]
            // 取章节详情
            if (!item) {
                continue
            }
            let htmlText = await getHTML(item.url)
            if (!htmlText) {
                continue
            }
            // 拿到了具体的章节内容
            const chapterInfo = parseChapter(htmlText)
            chapterInfo.book = id
            try {
                await new Chapter(chapterInfo).save()
                console.log(`${bookInfo.name} ${chapterInfo.title} 写入完成`)
            } catch (error) {
                fs.appendFileSync('./log.txt', `[150] ${bookInfo.name} ${chapterInfo.title} 写入失败，${error.message}`)
            }
        }
    }
}

run()