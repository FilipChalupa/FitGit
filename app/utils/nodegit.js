const nodegit = require('nodegit')

getBranches = function getBranches(path) {
	return nodegit.Repository.open(path)
		.then((repo) => {
			return repo.getReferenceNames(nodegit.Reference.TYPE.LISTALL)
		})
}

getPrefixedBranches = function getPrefixedBranches(path, prefix) {
	return getBranches(path)
		.then((allBranches) => {
			return allBranches.filter((branch) => branch.startsWith(prefix))
		})
		.then((branches) => {
			return branches.map((branch) => {
				return branch.substr(prefix.length)
			})
		})
}

getLocalBranches = function getLocalBranches(path) {
	return getPrefixedBranches(path, 'refs/heads/')
}

getRemoteBranches = function getRemoteBranches(path) {
	return getPrefixedBranches(path, 'refs/remotes/')
}

getCurrentBranch = function getCurrentBranch(path) {
	return nodegit.Repository.open(path)
		.then((repo) => {
			return repo.getCurrentBranch()
		})
		.then((branch) => {
			if (branch.isBranch()) {
				return branch.name().replace('refs/heads/', '')
			} else {
				return null
			}
		})
}


module.exports = {
	nodegit,
	getBranches,
	getPrefixedBranches,
	getLocalBranches,
	getRemoteBranches,
	getCurrentBranch,
}
