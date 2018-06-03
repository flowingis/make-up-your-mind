const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')

const filePath = path.join(__dirname, '..', 'sw.js')

const data = fs.readFileSync(filePath, 'utf8')

if (!data.startsWith('const VERSION')) {
  console.log('invalid format file')
  process.exit(1)
}

const toReplace = data.substring(0, data.indexOf('\n'))
const newVersionTag = `const VERSION = '${pkg.version}'`

if (toReplace !== newVersionTag) {
  const newFileContent = data.replace(toReplace, newVersionTag)

  fs.writeFileSync(filePath, newFileContent, 'utf8')
}
