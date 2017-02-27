const Git = require('nodegit')
const settings = require('electron-settings')
require('gitgraph.js')

const LIMIT = 100

module.exports = class GraphViewer {

	constructor(canvasId) {
		this.graph = new GitGraph({
			elementId: canvasId,
			template: 'metro',
			orientation: 'vertical'
		})

		this.count = 0

		this.branches = { // @TODO: Add more branches
			master: this.graph.branch('master'),
		}

		let repo
		settings.get('activeProjectId')
		.then((id) => {
			return settings.get(`projects.${id}`)
		})
		.then((project) => {
			return Git.Repository.open(project.path)
		})
		.then((r) => {
			repo = r
			return repo.getBranchCommit('master')
		})
		.then((commit) => {
			this.addCommit(commit, this.branches.master)
		})
		.catch((e) => {
			console.error(e)
		})
	}

	addCommit(commit, branch) {
		branch.commit({
			sha1: commit.sha().substr(-7),
			message: commit.message(),
			author: commit.author().toString(),
		})

		if (++this.count > LIMIT) {
			return
		}

		commit.parent(0).then((parent) => {
			this.addCommit(parent, branch)
		})
	}


}
