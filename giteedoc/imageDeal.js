const fs = require('fs')
const path = require('path')
const pages = require('./pages.json')
const cpy = require('cpy');

function writeFile (basepath,content) {
  fs.writeFileSync(basepath, content, { flag: 'w' })
}

function replaceImageSrc(content) {
  return content.replace(/\bsrc=(".+?")/g, (all, imgPath) => {
    let newPath = imgPath.match(/[^/]+(?=")/g);
    return `src="./img/${newPath}"`;
  });
}

for (let page of pages) {

  const htmlPath = `./books/${page.title}/html`
  const dirs = fs.readdirSync(htmlPath)

  cpy([`books/${page.title}/img/*`], `books/${page.title}/markdown/img`)

  for (let file of dirs) {
    const filePath = path.resolve(htmlPath, file)
    let f = fs.readFileSync(filePath, 'utf-8');
    f = replaceImageSrc(f)
    writeFile(filePath, f)
  }
}
