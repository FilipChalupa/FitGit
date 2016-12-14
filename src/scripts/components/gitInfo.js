const Git = require('nodegit')

module.exports = class {

	constructor(query) {
		this.$el = $(query)

		this.test = this.test.bind(this)

		this.$el.on('click', this.test)
	}

	test() {
		alert('test git info')
	}

}
