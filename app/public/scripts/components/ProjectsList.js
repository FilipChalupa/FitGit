const settings = require('electron-settings')

module.exports = class ClearSettings {

	constructor(query) {
		this.$el = $(query)

		this.update()

		$(window).on('projects-new', this.update.bind(this))
		this.$el.on('click', '.list-group-item', this.select.bind(this))
	}

	update() {
		let activeProjectId = null
		settings.get('activeProjectId').then((id) => {
			activeProjectId = id
			return settings.get('projects')
		}).then((projects) => {
			this.$el.empty()
			projects.forEach((project) => {
				this.$el.append(`
					<a href="#" class="list-group-item ${project.id === activeProjectId ? 'active' : ''}" data-id="${project.id}">
						<h4 class="list-group-item-heading">${project.name || '<i>Projekt bez názvu</i>'}</h4>
						<p class="list-group-item-text">${project.path}</p>
					</a>
				`)
			})
		})
	}

	select(e) {
		e.preventDefault()
		const $button = $(e.currentTarget)
		const selectedId = $button.data('id')

		settings.set('activeProjectId', selectedId).then(() => {
			this.$el.find('.list-group-item').removeClass('active')
			$button.addClass('active')
		})
	}
}
