
const request = require('request')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

async function getMuens (page) {
  const links = await page.$$eval(
    '.sidebar-link', els => els.map(v => ({
      href: v.href,
      text: v.innerHTML
    }))
  )
  return links
}

async function getsubMuens (page) {
  const sublinks = await page.$$eval(
    '.sidebar-sub-headers .sidebar-link', els => els.map(v => ({
      href: v.href,
      text: v.innerHTML
    }))
  )
  sublinks.map(({href,text}) => ({href, text}))
  return sublinks
}

async function getContent (page) {
  const content = await page.$eval('.theme-default-content', el => el.innerHTML)
  return content
}

async function getImgs (page) {
  const imgs = await page.$$eval('.theme-default-content img', els => els.map(v => v.src))
  return imgs
}


function writeFile (basepath, name,content) {
  name = name.replace(/[?？《》（）()":：.]/g, '')
  fs.writeFileSync(path.resolve(basepath, `./html/${name}.html`), content, { flag: 'a' })
}

let requestArr = []
let requesting = false
function requestImg () {
  if (requesting || requestArr.length === 0) return
  requesting = true
  setTimeout(() => {
    const {url, imgpath} = requestArr.shift()
    request(url).pipe(fs.createWriteStream(imgpath))
    requesting = false
    requestImg()
  }, 500)

}

function downloadImg (basepath, imgs) {
  for (let url of imgs) {
    const arr = url.split('/')
    if (url.indexOf('base64') > -1) return
    const name = arr[arr.length - 1]
    const imgpath = path.resolve(basepath, `./img/${name}`)
    requestArr.push({url, imgpath})
    requestImg()
  }
}

let browser = null

let init = async () => {
  browser = await puppeteer.launch({ headless: false })
}

let scrape = async (url,basepath) => {
  ;const page = await browser.newPage()
  await page.goto(url);

  const links = await getMuens(page)

  for (let p of links) {
    await page.goto(p.href);
    // const content = await getContent(page)
    const imgs = await getImgs(page)
    downloadImg(basepath, imgs)
    // const tilte = p.text
    // writeFile(basepath, tilte, content)
  }
}

let close = () => {
  browser.close()
}

module.exports = {scrape, init, close}