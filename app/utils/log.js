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

function info(input) {
	console.log(input)
	log.info(input.toString())
}


function error(input) {
	console.error(input)
	log.error(input.toString())
}


module.exports = {
	logDirectory: LOG_DIRECTORY,
	info,
	error,
}
