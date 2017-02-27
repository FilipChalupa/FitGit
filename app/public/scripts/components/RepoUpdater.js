const Git = require('nodegit')
const settings = require('electron-settings')
const notification = require('../utils/notification')

const UPDATE_INTERVAL = 1500
const FETCH_OPTIONS = {
	callbacks: {
		credentials: (url, userName) => {
			if (url.indexOf('http') === 0) {
				return Git.Cred.userpassPlaintextNew(userName, process.env.PASSWORD) // @TODO: Get actual password
			} else {
				return Git.Cred.sshKeyFromAgent(userName)
			}
		}
	}
}

module.exports = class RepoUpdater {

	constructor() {
		this.updateTimeout = null

		this.checkUpdates()
	}

	checkUpdates() {
		let lastKnownCommitHash
		let repo
		this.updateTimeout = setTimeout(() => {
			settings.get('activeProjectId')
			.then((id) => {
				return settings.get(`projects.${id}`)
			})
			.then((project) => {
				return Git.Repository.open(project.path)
			})
			.then((r) => {
				repo = r
				return repo.getBranchCommit('origin/master')
			})
			.then((commit) => {
				return commit.sha()
			})
			.catch((e) => {
				return null
			})
			.then((commitHash) => {
				lastKnownCommitHash = commitHash
				return repo.fetch('origin', FETCH_OPTIONS)
			})
			.then(() => {
				return repo.getBranchCommit('origin/master')
			})
			.then((commit) => {
				if (commit.sha() !== lastKnownCommitHash) {
					notification('Jsou k dispozici nové změny', `Autor ${commit.author()}`)
				}
				this.checkUpdates()
			})
			.catch((e) => {
				console.error(e)
				this.checkUpdates()
			})
		}, UPDATE_INTERVAL)
	}

}
