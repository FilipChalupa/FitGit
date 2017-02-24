const path = require('path')
const fse = require('fs-extra-promise')
const remote = require('electron').remote
const app = remote.getGlobal('app')

const WORKING_DIR = path.join(app.getPath('userData'), 'latex git')
fse.ensureDirSync(WORKING_DIR)


jQuery = $ = require('jquery')

Notifier = require('./scripts/components/notifier')
Repo = require('./scripts/components/repo')
GitInfo = require('./scripts/components/gitInfo')
UserData = require('./scripts/components/userData')
Restart = require('./scripts/components/restart')
