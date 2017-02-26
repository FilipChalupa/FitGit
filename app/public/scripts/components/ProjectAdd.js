const settings = require('electron-settings')
const dialog = require('electron').remote.dialog
const sha1 = require('sha1')
const path = require('path')

module.exports = class ClearSettings {

	constructor(query) {
		this.$el = $(query)
		this.$window = $(window)

		this.$el.on('click', this.add.bind(this))
	}

	add() {
		const dialogDirectories = dialog.showOpenDialog({properties: ['openDirectory']})
		if (dialogDirectories) {
			const repoDirectory = dialogDirectories[0] // Validate repository
			settings.get('projects').then((projects) => {
				projects.push({
					id: sha1(repoDirectory),
					name: path.basename(repoDirectory),
					path: repoDirectory,
				})
				return settings.set('projects', projects)
			}).then(() => {
				this.$window.trigger('projects-new')
			})
		}

	}
}
