const fse = require('fs-extra-promise')
const path = require('path')

module.exports = class UserData {

	constructor(query) {
		this.$el = $(query)

		this.test = this.test.bind(this)

		this.$el.on('click', this.test)
	}

	test() {
		const userDir = path.join(WORKING_DIR, 'tests', 'userData')
		fse.ensureDirSync(userDir)

		const testFile = path.join(userDir, 'test.txt')

		console.log(`Uživatelská složka: ${userDir}`)

		fse.writeFileSync(testFile, 'Hello World! ☃☃☃\n')
		console.log('Nyní by měl existovat soubor test.txt v uživatelské složce.')
		alert(testFile, 'Test dokončen')

	}

}
