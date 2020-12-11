const crawl = require('./crawl')
const makeDir = require('make-dir');
const pages = require('./pages.json')

const request = require('request')
const fs = require('fs')

async function dir (datas) {
  for (let item of datas) {
    await makeDir(`books/${item.title}`);
    await makeDir(`books/${item.title}/html`)
    await makeDir(`books/${item.title}/img`)
    await makeDir(`books/${item.title}/markdown`)
  }
}

async function scope () {
  await dir(pages)
  await crawl.init()
  for (let page of pages) {
    await crawl.scrape(page.url, `./books/${page.title}`)
  }

  crawl.close()
  
}

scope()

