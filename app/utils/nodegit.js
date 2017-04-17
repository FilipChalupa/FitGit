const nodegit = require('nodegit')

const getBranches = function getBranches(path) {
	return nodegit.Repository.open(path)
		.then((repo) => {
			return repo.getReferenceNames(nodegit.Reference.TYPE.LISTALL)
		})
}

const getPrefixedBranches = function getPrefixedBranches(path, prefix) {
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

const getLocalBranches = function getLocalBranches(path) {
	return getPrefixedBranches(path, 'refs/heads/')
}

const getRemoteBranches = function getRemoteBranches(path) {
	return getPrefixedBranches(path, 'refs/remotes/')
}

const getCurrentBranch = function getCurrentBranch(path) {
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

const getCommonTopCommit = function(repo, localTopCommit, remoteTopCommit) {
	const makeCommitForPool = (commit, isLocal, isRemote) => {
		return {
			commit,
			isLocal,
			isRemote,
		}
	}
	let commitsPool = [
		makeCommitForPool(localTopCommit, true, false),
		makeCommitForPool(remoteTopCommit, false, true),
	]
	const processPool = () => {
		if (commitsPool.length === 0) {
			return null
		}
		const nextCommit = commitsPool.reduce((accumulator, current) => {
			if (accumulator.commit.timeMs() < current.commit.timeMs()) {
				return current
			}
			return accumulator
		})
		commitsPool = commitsPool.filter((commit) => {
			if (commit.commit.sha() === nextCommit.commit.sha()) {
				nextCommit.isRemote = nextCommit.isRemote || commit.isRemote
				nextCommit.isLocal = nextCommit.isLocal || commit.isLocal
				return false
			} else {
				return true
			}
		})

		if (nextCommit.isLocal && nextCommit.isRemote) {
			return nextCommit.commit
		}
		return nextCommit.commit.getParents()
			.then((parents) => {
				commitsPool = commitsPool.concat(parents.map((commit) => {
					return makeCommitForPool(commit, nextCommit.isLocal, nextCommit.isRemote)
				}))
				return processPool()
			})
	}
	return processPool()
}


module.exports = {
	nodegit,
	getBranches,
	getPrefixedBranches,
	getLocalBranches,
	getRemoteBranches,
	getCurrentBranch,
	getCommonTopCommit,
}
