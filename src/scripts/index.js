const fs = require('fs')

const WORKING_DIR = `${__dirname}/user_data`
if (!fs.existsSync(WORKING_DIR)) {
	fs.mkdirSync(WORKING_DIR)
}


jQuery = $ = require('jquery')

Notifier = require('./scripts/components/notifier')
Repo = require('./scripts/components/repo')
