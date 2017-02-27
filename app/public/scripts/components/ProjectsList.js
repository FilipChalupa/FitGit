const settings = require('electron-settings')

module.exports = class ClearSettings {

	constructor(query) {
		this.$el = $(query)
		this.$window = $(window)

		this.loadProjects()

		this.$window.on('projects-new', this.onNew.bind(this))
		this.$window.on('projects-select', this.onWindowSelect.bind(this))
		this.$el.on('click', '.list-group-item', this.onButtonSelect.bind(this))

		this.projects = {}
	}

	onNew(e, project) {
		this.appendProject(project)
	}

	onWindowSelect(e, project) {
		this.$el.find(`.list-group-item[data-id="${project.id}"]`).trigger('click') // @TODO: Trigger click is bad
	}

	appendProject(project) {
		if (this.projects[project.id]) { // Already present
			return
		}
		this.projects[project.id] = project
		this.$el.append(`
			<a href="#" class="list-group-item ${project.id === this.activeProjectId ? 'active' : ''}" data-id="${project.id}">
				<h4 class="list-group-item-heading">${project.name || '<i>Projekt bez názvu</i>'}</h4>
				<p class="list-group-item-text">${project.path}</p>
			</a>
		`)
	}

	loadProjects() {
		this.activeProjectId = null
		settings.get('activeProjectId').then((id) => {
			this.activeProjectId = id
			return settings.get('projects')
		}).then((projects) => {
			this.$el.empty()
			this.projects = {}
			for (const id in projects) {
				this.appendProject(projects[id])
			}
		})
	}

	onButtonSelect(e) {
		e.preventDefault()
		const $button = $(e.currentTarget)
		this.activeProjectId = $button.data('id')

		settings.set('activeProjectId', this.activeProjectId).then(() => {
			this.$el.find('.list-group-item').removeClass('active')
			$button.addClass('active')
			this.$window.trigger('project-selected', [this.projects[this.activeProjectId]])
		})
	}
}
