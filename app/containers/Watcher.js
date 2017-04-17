const React = require('react')
const e = React.createElement
const Component = React.Component
const connect = require('react-redux').connect
const bindActionCreators = require('redux').bindActionCreators
const n = require('../utils/nodegit')
const nodegit = n.nodegit
const getCommonTopCommit = n.getCommonTopCommit
const ProjectsActions = require('../actions/projects')
const IntegratorActions = require('../actions/integrator')
const MenuActions = require('../actions/menu')
const remoteCallbacks = require('../utils/remoteCallbacks')
const notify = require('../utils/notify')
const hashHistory = require('react-router').hashHistory

const CHECK_INTERVAL = 1500

class Watcher extends Component {

	componentDidMount() {
		this.check()
	}


	refreshCanCommit(repo) {
		repo.getStatus()
			.then((artifacts) => {
				this.props.actions.menu.canCreateCommit(repo.isDefaultState() && artifacts.length !== 0)
			})
	}


	push(repo, remoteName, localBranchReference) {
		return repo.getRemote(remoteName)
			.then((remote) => {
				const refName = localBranchReference.toString()
				return remote.push([
					`${refName}:${refName}`
				], remoteCallbacks)
			})
			.then(() => {
				notify('Vaše změny byly nasdíleny', 'zobrazit historii', () => {
					hashHistory.push('/history')
				})
			})
			.catch((error) => console.log('push error', error))
	}

	check() {
		let repo
		let remoteName
		let localBranch
		let localTopCommit
		let remoteOldTopCommit
		let remoteNewTopCommit
		let commonTopCommit

		if (!this.props.projects.active || this.props.loading) {
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
				localBranch = reference
				return repo.getBranchCommit(localBranch)
					.then((commit) => localTopCommit = commit)
					.then(() => nodegit.Branch.upstream(localBranch))
			})
			.then((reference) => {
				remoteName = reference.toString().split('/')[2] // Returns for example "origin"
				return repo.getBranchCommit(reference)
					.then((commit) => remoteOldTopCommit = commit)
					.then(() => {
						return repo.fetch(remoteName, remoteCallbacks)
							.then(() => nodegit.Branch.upstream(localBranch))
					})
			})
			.then((reference) => {
				return repo.getBranchCommit(reference)
					.then((commit) => remoteNewTopCommit = commit)
			})
			.then(() => getCommonTopCommit(repo, localTopCommit, remoteNewTopCommit))
			.then((commit) => {
				commonTopCommit = commit
				this.props.actions.integrator.setIntegrationAvailable(
					remoteNewTopCommit && (!commonTopCommit || (remoteNewTopCommit.sha() !== commonTopCommit.sha())),
					remoteNewTopCommit && (!remoteOldTopCommit || (remoteNewTopCommit.sha() !== remoteOldTopCommit.sha()))
				)

				const push = () => {
					if (this.props.settings.autoPush) {
						return this.push(repo, remoteName, localBranch)
					}
					return
				}
				if (localTopCommit) {
					if (!remoteNewTopCommit) { // Never pushed
						return push()
					}
					if (!commonTopCommit) { // No common parent
						return
					}
					if (commonTopCommit.sha() === localTopCommit.sha()) { // Nothing to push
						return
					}
					if (commonTopCommit.sha() === remoteNewTopCommit.sha()) { // Able to push
						return push()
					}
				}
			})
			.then(() => this.refreshCanCommit(repo))
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
		loading: state.loading,
		projects: state.projects,
		settings: state.settings,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			integrator: bindActionCreators(IntegratorActions, dispatch),
			menu: bindActionCreators(MenuActions, dispatch),
			projects: bindActionCreators(ProjectsActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Watcher)
