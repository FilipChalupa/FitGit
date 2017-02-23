const notification = require('../utils/notification')

module.exports = class {

	constructor(query) {
		this.$el = $(query)

		this.$el.on('click', this.notify)
	}

	notify() {
		notification('Jsou k dispozici nové změny', 'od autora Jan Novák')
	}
}
