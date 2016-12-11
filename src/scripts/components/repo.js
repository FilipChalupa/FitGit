const git = require('simple-git')
const fs = require('fs')
const writeFile = require('../utils/writeFile.js')

module.exports = class {

	constructor(query) {
		this.$el = $(query)

		this.$el.on('click', this.test)
	}

	test() {
		const repoDir = `${WORKING_DIR}/${Date.now()}`
		fs.mkdirSync(repoDir)
		const repo = git(repoDir)

		repo.init()
			.then(() => {
				console.log('Byl vytvořen nový repozitář')

				return writeFile(`${repoDir}/test.txt`, 'Hello World!\n')
			})
			.add(`${repoDir}/*`)
			.commit('Test commit')
			.then(() => {
				console.log('Byl vytvořen počáteční testovací commit')

				return writeFile(`${repoDir}/test.txt`, 'Hello ČVUT!\n')
			})
			.add(`${repoDir}/*`).commit('Update: World changed to CTU')
			.then(() => {
				console.log('Byl vytvořen druhý testovací commit')
			})

	}
}
