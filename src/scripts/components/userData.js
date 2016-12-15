const remote = require('electron').remote
const fse = require('fs-extra-promise')
const path = require('path')

const app = remote.getGlobal('app')

module.exports = class {

	constructor(query) {
		this.$el = $(query)

		this.test = this.test.bind(this)

		this.$el.on('click', this.test)
	}

	test() {
		const userDir = path.join(app.getPath('userData'), 'User Data')
		fse.ensureDirSync(userDir)

		console.log(`Uživatelská složka: ${userDir}`)

		fse.writeFileSync(path.join(userDir, 'test.txt'), 'Hello World! ☃☃☃\n')
		console.log('Nyní by měl existovat soubor test.txt v uživatelské složce.')
		alert('Test dokončen')

	}

}
