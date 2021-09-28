const fs = require('fs')
const cheerio = require('cheerio')

let basePath = ''
let articles = []
function getPath(filename) {
    let paths = filename.split('/')
    paths.pop()
    return paths.length > 0 ? (paths.join('/') + '/') : './'
}

async function readHTML(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(cheerio.load(data))
            }
        })
    })
}

async function searchPage(article, path) {
    let figures = article('figure.link-to-page')
    for (let figure of figures) {
        figure.attribs['id']
        if (figure.children[0].name === 'a') {
            let href = figure.children[0].attribs['href']
            figure.children[0].attribs['href'] = '#' + figure.attribs['id']
            figure.children[0].attribs['class'] = 'internal-link'
            await loadHTML(basePath + decodeURIComponent(href))
        }
        figure.attribs['id'] = ''
    }

    let images = article('img')
    for (let image of images) {
        image.attribs['src'] = path + image.attribs['src']
    }
}

async function loadHTML(filepath) {
    let $ = await readHTML(filepath)
    let article = cheerio.load($('article').parent().html())
    if (article) {
        console.log('load success : ' + filepath)
        articles.push(article)
        await searchPage(article, getPath(filepath))
    }
}

async function makeResult(filepath) {
    let html = await readHTML(filepath)
    html('head').append(`
    <style>
      a { color: #435ce8; text-decoration: none}
      a.internal-link {
        color: #333;
        text-decoration: underline;
      }
      .code, code {font-size:1.2em;word-break:break-word;white-space: pre-line;} 
      .link-to-page > a {font-size: 1.2em;font-weight:400;} 
      .page-title { background-color:#f5f5f5;font-size:3em !important;padding:16px 10px;margin-top: 80px;}
    </style>`)
    html('body').html('')
    articles.forEach(a => html('body').append(a.html()))

    let anchors = html('a')
    for (let anchor of anchors) {
        let matches = anchor.attribs['href'].match(/([a-z0-9]{32})\.html/)
        if (matches) {
            let id = matches[1].split('')
            id.splice(20, 0, '-')
            id.splice(16, 0, '-')
            id.splice(12, 0, '-')
            id.splice(8, 0, '-')
            id = id.join('')

            let found = html('#' + id)
            if (found && found[0]) {
                anchor.attribs['href'] = '#' + id
                anchor.attribs['class'] = 'internal-link'
            }
        }
    }
    fs.writeFileSync(basePath + 'out.html', html.html())
}

async function start(filepath) {
    basePath = getPath(filepath)
    console.log('base : ', basePath)
    await loadHTML(filepath)
    makeResult(filepath)
}

if (process.argv[2]) {
    start(process.argv[2])
}
