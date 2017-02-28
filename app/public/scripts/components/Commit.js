const Git = require('nodegit')
const settings = require('electron-settings')
const sha1 = require('sha1')

module.exports = class Commit {

	constructor(queryList, querySubmit, queryMessage) {
		this.$list = $(queryList)
		this.$submit = $(querySubmit)
		this.$message = $(queryMessage)

		this.$list.on('click', '.list-group-item', this.onButtonSelect.bind(this))
		this.$submit.on('click', this.onSubmit.bind(this))

		this.getStatus()
	}

	statusToText(status) {
		let words = []
		if (status.isNew()) { words.push('NEW') }
		if (status.isModified()) { words.push('MODIFIED') }
		if (status.isTypechange()) { words.push('TYPECHANGE') }
		if (status.isRenamed()) { words.push('RENAMED') }
		if (status.isIgnored()) { words.push('IGNORED') }

		return words.join(' ')
	}

	getStatus() {
		this.$list.empty()

		let repo
		settings.get('activeProjectId')
		.then((id) => {
			return settings.get(`projects.${id}`)
		})
		.then((project) => {
			return Git.Repository.open(project.path)
		})
		.then((repo) => {
			this.repo = repo
			return repo.getStatus()
		})
		.then((statuses) => {
			this.files = {}
			statuses.forEach((file) => {
				const id = sha1(file.path())
				this.files[id] = file
				this.$list.append(`
					<a href="#" class="list-group-item ${file.inIndex() ? 'active' : ''}" data-id="${id}">
						[${this.statusToText(file)}] ${file.path()}
					</a>
				`)
			})
		})
		.catch((e) => {
			console.error(e)
		})
	}

	onButtonSelect(e) {
		e.preventDefault()
		const $button = $(e.currentTarget)
		const file = this.files[$button.data('id')]

		let index
		this.repo.refreshIndex()
		.then((idx) => {
			index = idx
			if (file.inIndex()) {
				return index.removeByPath(file.path()) // @TODO: This is not the usual unstage
			} else {
				return index.addByPath(file.path())
			}
		})
		.then(() => {
			return index.write()
		})
		.then(() => {
			$button.toggleClass('active', file.inIndex())
		})
		.catch((e) => {
			console.error(e)
		})
	}

	onSubmit() {
		const message = this.$message.val()
		if (!message) {
			this.$message.focus()
			return
		}
		this.$submit.prop('disabled', true)

		let oid
		const author = Git.Signature.create('Scott Chacon', 'schacon@gmail.com', Math.floor(Date.now() / 1000), (new Date).getTimezoneOffset()) // @TODO: Get real author
		this.repo.refreshIndex()
		.then((index) => {
			return index.writeTree()
		})
		.then((oidResult) => {
			oid = oidResult
			return Git.Reference.nameToId(this.repo, 'HEAD')
		})
		.then((head) => {
			return this.repo.getCommit(head)
		})
		.then((parent) => {
			return this.repo.createCommit('HEAD', author, author, message, oid, [parent])
		})
		.then(() => {
			location.reload()
		})
		.catch((e) => {
			this.$submit.prop('disabled', false)
			console.error(e)
		})
	}


}
