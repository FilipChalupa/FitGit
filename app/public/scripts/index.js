const path = require('path')
const fse = require('fs-extra-promise')
const remote = require('electron').remote
const app = remote.getGlobal('app')

const WORKING_DIR = path.join(app.getPath('userData'), 'latex git')
fse.ensureDirSync(WORKING_DIR)

require('./scripts/utils/settingsDefaults')


jQuery = $ = require('jquery')

Notifier = require('./scripts/components/Notifier')
Repo = require('./scripts/components/Repo')
GitInfo = require('./scripts/components/GitInfo')
UserData = require('./scripts/components/UserData')
Restart = require('./scripts/components/Restart')
ClearSettings = require('./scripts/components/ClearSettings')
ProjectsList = require('./scripts/components/ProjectsList')
ProjectAdd = require('./scripts/components/ProjectAdd')
