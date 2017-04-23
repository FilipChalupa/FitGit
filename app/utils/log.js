const path = require('path')
const fs = require('fs')
const app = require('electron').remote.app

const LOG_DIRECTORY = path.resolve(app.getPath('userData'), 'logs')
if (!fs.existsSync(LOG_DIRECTORY)) {
	fs.mkdirSync(LOG_DIRECTORY)
}

const currentLogFile = path.resolve(LOG_DIRECTORY, `${Date.now().toString()}.txt`)


const log = require('simple-node-logger').createSimpleLogger(currentLogFile)

log.logDirectory = LOG_DIRECTORY


module.exports = log
