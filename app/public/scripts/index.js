const path = require('path')
const fse = require('fs-extra-promise')

const WORKING_DIR = path.join(__dirname, 'user_data')
fse.ensureDirSync(WORKING_DIR)


jQuery = $ = require('jquery')

Notifier = require('./scripts/components/notifier')
Repo = require('./scripts/components/repo')
GitInfo = require('./scripts/components/gitInfo')
UserData = require('./scripts/components/userData')
Restart = require('./scripts/components/restart')
