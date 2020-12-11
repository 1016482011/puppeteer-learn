const fs = require('fs')
const path = require('path')
const TurndownService = require('turndown')

const pages = require('./pages.json')

const turndownService = new TurndownService()

for (let page of pages) {
  const htmlPath = `./books/${page.title}/html`
  const dirs = fs.readdirSync(htmlPath)
  for (let file of dirs) {
    const f = fs.readFileSync(path.resolve(htmlPath, file), 'utf-8');
    const markdown = turndownService.turndown(f)
    fs.writeFile(`./books/${page.title}/markdown/${file.replace('.html', '')}.md`, markdown, function (error) {
      console.log(file + '转换完成')
    })
  }
}



