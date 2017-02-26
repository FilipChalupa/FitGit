const settings = require('electron-settings');

module.exports = class ClearSettings {

	constructor(query) {
		this.$el = $(query)

		this.$el.on('click', this.clear.bind(this))
	}

	clear() {
		settings.clearSync() // @TODO: do it async
		alert('Nastavení smazáno.')
		location.reload()
	}
}
