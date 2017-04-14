const React = require('react')
const e = React.createElement
const Component = React.Component
const connect = require('react-redux').connect
const bindActionCreators = require('redux').bindActionCreators
const nodegit = require('../utils/nodegit').nodegit
const ProjectsActions = require('../actions/projects')
const IntegratorActions = require('../actions/integrator')
const remoteCallbacks = require('../utils/remoteCallbacks')

const CHECK_INTERVAL = 1500

class Watcher extends Component {

	componentDidMount() {
		this.check()
	}

	getBranchCommitHash(repo, branch) {
		return repo.getBranchCommit(branch)
			.then((commit) => commit.sha())
	}

	check() {
		let repo
		let localReference
		let localCommitHash
		let remoteOldCommitHash
		let remoteNewCommitHash

		if (!this.props.projects.active) {
			setTimeout(() => {
				this.check()
			}, CHECK_INTERVAL)
			return
		}

		nodegit.Repository.open(this.props.projects.active.path)
			.then((r) => {
				repo = r
				return repo.getCurrentBranch()
			})
			.then((reference) => {
				localReference = reference
				return this.getBranchCommitHash(repo, reference)
					.then((hash) => localCommitHash = hash)
					.then(() => nodegit.Branch.upstream(localReference))
			})
			.then((reference) => {
				const remoteName = reference.toString().split('/')[2] // Returns for example "origin"
				return this.getBranchCommitHash(repo, reference)
					.then((hash) => {
						remoteOldCommitHash = hash
					})
					.then(() => {
						return repo.fetch(remoteName, remoteCallbacks)
							.then(() => nodegit.Branch.upstream(localReference))
					})
			})
			.then((reference) => {
				return this.getBranchCommitHash(repo, reference)
					.then((hash) => {
						remoteNewCommitHash = hash
					})
			})
			.then(() => {
				this.props.actions.integrator.setIntegrationAvailable(localCommitHash !== remoteNewCommitHash, remoteOldCommitHash !== remoteNewCommitHash)
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				setTimeout(() => {
					this.check()
				}, CHECK_INTERVAL)
			})
	}

	render() {
		return null
	}
}


function mapStateToProps(state) {
	return {
		integrator: state.integrator,
		projects: state.projects,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			integrator: bindActionCreators(IntegratorActions, dispatch),
			projects: bindActionCreators(ProjectsActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Watcher)
