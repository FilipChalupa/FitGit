const path = require('path')
const fse = require('fs-extra-promise')
const remote = require('electron').remote
const app = remote.getGlobal('app')

const WORKING_DIR = path.join(app.getPath('userData'), 'latex git')
fse.ensureDirSync(WORKING_DIR)


jQuery = $ = require('jquery')

Notifier = require('./scripts/components/Notifier')
Repo = require('./scripts/components/Repo')
GitInfo = require('./scripts/components/GitInfo')
UserData = require('./scripts/components/UserData')
Restart = require('./scripts/components/Restart')
