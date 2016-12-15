const Git = require('nodegit')

module.exports = class {

	constructor(query) {
		this.$el = $(query)

		this.test = this.test.bind(this)

		this.$el.on('click', this.test)
	}

	test() {
		let config
		Git.Config.openDefault().then((c) => {
			config = c
			return config.getString('user.name')
		}).then((username) => {
			console.log(`User.name: ${username}`)
			alert(`Uživatelské jméno: ${username}`)
			return config.getString('user.email')
		}).then((email) => {
			console.log(`User.email: ${email}`)
		})
	}

}
