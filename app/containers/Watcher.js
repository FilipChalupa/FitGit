const React = require('react')
const e = React.createElement
const Component = React.Component
const connect = require('react-redux').connect
const bindActionCreators = require('redux').bindActionCreators
const n = require('../utils/nodegit')
const nodegit = n.nodegit
const getCommonTopCommit = n.getCommonTopCommit
const countCommitStats = n.countCommitStats
const ProjectsActions = require('../actions/projects')
const IntegratorActions = require('../actions/integrator')
const MenuActions = require('../actions/menu')
const LoadingActions = require('../actions/loading')
const remoteCallbacks = require('../utils/remoteCallbacks')
const notify = require('../utils/notify')
const redirectWithReload = require('../utils/redirectWithReload')
const exec = require('child-process-promise').exec
const log = require('../utils/log')
const t = require('../utils/text')

const CHECK_INTERVAL = 3000

class Watcher extends Component {

	constructor(props) {
		super(props)

		this.lastProblems = {
			usernamePassword: null,
		}

		this.notifyAboutCommitSuggestion = true
	}


	componentDidMount() {
		this.check()
	}


	refreshCanCommit(repo, localTopCommit) {
		if (!repo) {
			return
		}
		let index
		let treeB
		let available = false
		let notification = false
		return Promise.resolve()
			.then(() => repo.getStatus())
			.then((artifacts) => available = repo.isDefaultState() && artifacts.length !== 0)
			.then(() => {
				if (localTopCommit) {
					return Promise.resolve()
						.then(() => localTopCommit.getTree())
						.then((t) => treeB = t)
						.then((t) => repo.index())
						.then((i) => index = i)
						.then(() => index.addAll())
						.then(() => index.writeTree())
						.then((oid) => nodegit.Tree.lookup(repo, oid))
						.then((treeA) => countCommitStats(treeA, treeB))
						.then((stats) => {
							let statsBetterOrEqToMedian = 0
							const statKeys = ['additions', 'removals', 'files']
							statKeys.forEach((statKey) => {
								if (stats[statKey] >= this.props.projects.active.stats[statKey]) {
									statsBetterOrEqToMedian++
								}
							})
							notification = this.notifyAboutCommitSuggestion && available && !this.props.integrator.commitNotification && statsBetterOrEqToMedian > 1
							if (notification) {
								this.notifyAboutCommitSuggestion = false
							} else if (!available) {
								this.notifyAboutCommitSuggestion = true
							}

						})
				}
			})
			.catch((error) => log.error(error))
			.then(() => {
				this.props.actions.integrator.setCommitAvailable(
					available,
					notification,
					t(this.props.settings.language, 'notification_cancommit_title'),
					t(this.props.settings.language, 'notification_cancommit_message'),
					'/commit'
				)
			})
	}


	push(repo, remoteName, localBranchReference) {
		const refName = localBranchReference.toString()
		return repo.getRemote(remoteName)
			.then((remote) => {
				return remote.push([
					`${refName}:${refName}`
				], remoteCallbacks)
			})
			.then(() => {
				notify('Vaše změny byly nasdíleny', 'zobrazit historii', () => {
					redirectWithReload('/history')
				})
			})
			.catch((error) => console.error(error))
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
			if (!this.props.projects.active) {
				this.props.actions.integrator.dismissNotification()
				this.props.actions.integrator.dismissCommitNotification()
			}
			setTimeout(() => {
				this.check()
			}, CHECK_INTERVAL)
			return
		}

		nodegit.Repository.open(this.props.projects.active.path)
			.then((r) => repo = r)
			.then(() => repo.getCurrentBranch())
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
					remoteNewTopCommit && (!remoteOldTopCommit || (remoteNewTopCommit.sha() !== remoteOldTopCommit.sha())),
					t(this.props.settings.language, 'notification_updates_title'),
					t(this.props.settings.language, 'notification_updates_message'),
					'/integrateChanges'
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
			.catch((error) => {
				// Try to fix repo
				this.props.actions.loading.IncrementLoadingJobs()
				return Promise.resolve()
					.then(() => {
						if (!localBranch || !localBranch.isBranch()) {
							log.info('Local branch unknown')
							return repo.fetch('origin', remoteCallbacks)
								.catch((error) => {
									log.info('Unable to fetch')
									return repo.getRemote('origin')
										.then((remote) => remote.url())
										.then((url) => {
											if (url.startsWith('http') && this.lastProblems.usernamePassword !== url) {
												this.lastProblems.usernamePassword = url
												notify('Nepodařilo se stáhnout projekt', 'zkuste zkontrolovat přístupové údaje', () => {
													redirectWithReload('/project')
												})
											}
										})
									throw error
								})
								.then(() => repo.getBranchCommit('origin/master'))
								.then((commit) => {
									if (commit) {
										return repo.createBranch('master', commit, true)
											.then(() => repo.checkoutBranch('master'))
											.then(() => nodegit.Reset(repo, commit, nodegit.Reset.TYPE.HARD))
									}
								})
						} else if (!remoteName) {
							log.info('Remote unknown')
							return exec(`cd ${this.props.projects.active.path} && git branch --set-upstream-to=origin/master`)
								.catch((out) => {
									log.info(out)

									log.info('Pushing maybe the first commit')
									return exec(`cd ${this.props.projects.active.path} && git push -u origin master`)
								})
						} else {
							throw error
						}
					})
					.catch((error) => {
						log.error(error)
					})
					.then(() => {
						this.props.actions.loading.DecrementLoadingJobs()
					})
			})
			.then(() => this.refreshCanCommit(repo, localTopCommit))
			.catch((error) => {
				log.error(error)
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
			loading: bindActionCreators(LoadingActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Watcher)
