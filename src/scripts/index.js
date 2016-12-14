const fse = require('fs-extra-promise')
const path = require('path')

const WORKING_DIR = path.join(__dirname, 'user_data')
fse.ensureDirSync(WORKING_DIR)


jQuery = $ = require('jquery')

Notifier = require('./scripts/components/notifier')
Repo = require('./scripts/components/repo')
GitInfo = require('./scripts/components/gitInfo')
