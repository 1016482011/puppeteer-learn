const request = require('request')
const fs = require('fs')
const puppeteer = require('puppeteer')

const reg = /\/(\S*).png/

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto('https://www.v2ex.com')
  const preloadHref = await page.$eval(
    '#TopicsHot .cell:nth-child(2) span > a',
    el => el.href
  )
  await page.goto(preloadHref)
  const title = await page.$eval('#Main .header h1', el => el.innerHTML)
  const img = await page.$eval('#Main .header img', el => el.src)
  const clickcount = await page.$eval('#Main .header .gray', el => el.innerHTML)
  const content = await page.$eval(
    '#Main .topic_content .markdown_body',
    el => el.innerHTML
  )
  const subcontent = await page.$$eval('#Main .subtle .topic_content', els => {
    let content = ''
    els.forEach(el => {
      content += el.innerHTML
    })
    return content
  })
  console.log(title)
  console.log(img)
  console.log(clickcount)
  console.log(content)
  console.log(subcontent)
  const writeText = `${title}\n${clickcount}\n${content}\n${subcontent}`
  fs.writeFile('./data/data.txt', writeText, { flag: 'a' }, function(err) {
    if (err) {
      throw err
    }
  })
  const urlArr = img.match(/\d\/(\S*)\?/)[1].split('/')
  request(img).pipe(fs.createWriteStream(`./img/${urlArr[urlArr.length - 1]}`))
  await browser.close()
}

scrape()
