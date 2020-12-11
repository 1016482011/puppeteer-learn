const pages = require('./pages.json')
const del = require('del');

let arr = []

for (let page of pages) {
  const markdown = `./books/${page.title}/markdown/**`
  const img = `./books/${page.title}/img/**`
  arr.push(markdown, img)
}
del.sync(arr);