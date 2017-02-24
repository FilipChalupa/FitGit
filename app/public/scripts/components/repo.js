const Git = require('nodegit')
const fse = require('fs-extra-promise')
const path = require('path')

module.exports = class {

	constructor(query) {
		this.$el = $(query)

		this.test = this.test.bind(this)

		this.$el.on('click', this.test)
	}

	test() {
		const repoDir = path.join(WORKING_DIR, 'tests', 'repo', Date.now().toString())

		fse.ensureDirSync(repoDir)

		let repository
		let index
		let oid
		let testFileName = 'test.txt'
		const author = Git.Signature.create('Scott Chacon', 'schacon@gmail.com', Math.floor(Date.now() / 1000), (new Date).getTimezoneOffset())

		Git.Repository.init(repoDir, 0)
		.then((repo) => {
			repository = repo
		})
		.then(() => {
			return fse.writeFileSync(path.join(repository.workdir(), testFileName), 'Hello World!\n☃\n')
		})
		.then(() => {
			return repository.refreshIndex()
		})
		.then((idx) => {
			index = idx
		})
		.then(() => {
			return index.addByPath(testFileName)
		})
		.then(() => {
			return index.write()
		})
		.then(() => {
			return index.writeTree()
		})
		.then((oid) => {
			return repository.createCommit('HEAD', author, author, 'Init', oid, [])
		})
		.then((id) => {
			console.log(`Commit s id ${id} byl úspěšně vytvořen.`)
		})
		.then(() => {
			return fse.writeFileSync(path.join(repository.workdir(), testFileName), 'Hello CTU!\n☃\n')
		})
		.then(() => {
			return repository.refreshIndex()
		})
		.then(() => {
			return repository.getStatus()
		})
		.then((statuses) => {
			console.log('Status:')
			statuses.forEach((file) => {
				console.log(`\t${file.path()} ${this.statusToText(file)}`)
			})
		})
		.then(() => {
			return repository.refreshIndex()
		})
		.then((idx) => {
			index = idx
		})
		.then(() => {
			return index.addByPath(testFileName)
		})
		.then(() => {
			return index.write()
		})
		.then(() => {
			return index.writeTree()
		})
		.then((oidResult) => {
			oid = oidResult
			return Git.Reference.nameToId(repository, 'HEAD')
		})
		.then((head) => {
			return repository.getCommit(head)
		})
		.then((parent) => {
			return repository.createCommit('HEAD', author, author, 'Update commit', oid, [parent])
		})
		.then((id) => {
			console.log(`Commit s id ${id} byl úspěšně vytvořen.`)
			alert('Test se zdařil.', 'Git')
		})
		.catch((e) => {
			console.error('Během testu vytváření commitů došlo k chybě.')
			console.error(e)
		})
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

}
