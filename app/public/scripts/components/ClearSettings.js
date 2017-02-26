const settings = require('electron-settings');

module.exports = class ClearSettings {

	constructor(query) {
		this.$el = $(query)

		this.$el.on('click', this.clear.bind(this))
	}

	clear() {
		settings.clear().then(() => {
			return settings.applyDefaults()
		}).then(() => {
			alert('Nastavení smazáno.')
			location.reload()
		})
	}
}
