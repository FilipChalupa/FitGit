const settings = require('electron-settings')
const dialog = require('electron').remote.dialog
const sha1 = require('sha1')
const path = require('path')
const Git = require('nodegit')

module.exports = class ClearSettings {

	constructor(queryFromLocal, queryFromUrl, queryFromUrlInput) {
		this.$fromLocal = $(queryFromLocal)
		this.$fromUrl = $(queryFromUrl)
		this.$fromUrlInput = $(queryFromUrlInput)
		this.$window = $(window)

		this.$fromLocal.on('click', this.addFromLocal.bind(this))
		this.$fromUrl.on('click', this.addFromUrl.bind(this))
	}

	setState($el, waiting) {
		$el.prop('disabled', waiting)
		if ($el.is(this.$fromUrl) && !waiting) {
			this.$fromUrlInput.val('')
		}
	}

	addFromLocal() {
		this.setState(this.$fromLocal, true)
		const dialogDirectories = dialog.showOpenDialog({properties: ['openDirectory']})
		if (!dialogDirectories) {
			this.setState(this.$fromLocal, false)
			return
		}
		const repoDirectory = dialogDirectories[0] // @TODO: Validate repository exists
		settings.get('projects').then((projects) => {
			projects.push({ // @TODO: do it dry
				id: sha1(repoDirectory),
				name: path.basename(repoDirectory),
				path: repoDirectory,
			})
			return settings.set('projects', projects)
		}).then(() => {
			this.$window.trigger('projects-new')
			this.setState(this.$fromLocal, false)
		}).catch(() => {
			this.setState(this.$fromLocal, false)
		})
	}

	addFromUrl() {
		this.setState(this.$fromUrl, true)
		let url = this.$fromUrlInput.val()
			if (!url) {
				this.setState(this.$fromUrl, false)
				this.$fromUrlInput.focus()
				return
			}
			const dialogDirectories = dialog.showOpenDialog({
				title: 'Vyberte umístění, kam se má projekt stáhnout',
				properties: ['openDirectory'],
			})
			if (!dialogDirectories) {
				this.setState(this.$fromUrl, false)
				return
			}

			const repoDirectory = dialogDirectories[0]
			Git.Repository.init(repoDirectory, 0)
			.then((repo) => {
				return Git.Remote.create(repo, 'origin', url)
			})
			.then((remote) => {
				return settings.get('projects')
			})
			.then((projects) => {
				projects.push({ // @TODO: do it dry
					id: sha1(repoDirectory),
					name: path.basename(repoDirectory),
					path: repoDirectory,
				})
				return settings.set('projects', projects)
			}).then(() => {
				this.$window.trigger('projects-new')
				this.setState(this.$fromUrl, false)
			}).catch(() => {
				this.setState(this.$fromUrl, false)
			})
	}
}
