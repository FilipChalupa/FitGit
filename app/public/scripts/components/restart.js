module.exports = class {

	constructor(query) {
		this.$el = $(query)

		this.do = this.do.bind(this)

		this.$el.on('click', this.do)
	}

	do() {
		location.reload()
	}

}
