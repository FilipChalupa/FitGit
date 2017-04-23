const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const RaisedButton = require('material-ui/RaisedButton').default
const IconButton = require('material-ui/IconButton').default
const RefreshIcon = require('material-ui/svg-icons/navigation/refresh').default
const n = require('../utils/nodegit')
const nodegit = n.nodegit
const getCommonTopCommit = n.getCommonTopCommit
const IntegratorActions = require('../actions/integrator')
const LoadingActions = require('../actions/loading')
const StatusActions = require('../actions/status')
const Diff = require('./Diff')
const hashHistory = require('react-router').hashHistory
const exec = require('child-process-promise').exec
const log = require('../utils/log')
const t = require('../utils/text')

class IntegrateChanges extends Component {

	constructor(props) {
		super(props)

		this.state = {
			updating: false,
			shaA: null,
			shaB: null,
		}

		this.repo = null
		this.localBranch = null
		this.remoteBranch = null
		this.localTopCommit = null
		this.remoteTopCommit = null
		this.commonTopCommit = null
	}

	setUpdating(updating) {
		this.setState(Object.assign({}, this.state, { updating }))
		if (updating) {
			this.props.actions.loading.IncrementLoadingJobs()
		} else {
			this.props.actions.loading.DecrementLoadingJobs()
		}
	}

	componentDidMount() {
		this.refresh()
		this.props.actions.integrator.dismissNotification()
	}

	refresh() {
		if (!this.props.projects.active) {
			hashHistory.push('/projects')
			return
		}
		this.setUpdating(true)
		let localBranch
		let remoteBranch
		nodegit.Repository.open(this.props.projects.active.path)
			.then((r) => {
				this.repo = r
				return this.repo.getCurrentBranch()
			})
			.then((reference) => {
				this.localBranch = reference
				return this.repo.getBranchCommit(this.localBranch)
					.then((commit) => this.localTopCommit = commit)
					.then(() => nodegit.Branch.upstream(this.localBranch))
			})
			.then((reference) => {
				this.remoteBranch = reference
				return this.repo.getBranchCommit(this.remoteBranch)
					.then((commit) => this.remoteTopCommit = commit)
			})
			.then(() => {
				return getCommonTopCommit(this.repo, this.localTopCommit, this.remoteTopCommit)
			})
			.then((commit) => {
				this.commonTopCommit = commit
				if (this.remoteTopCommit) {
					Promise.resolve()
						.then(() => {
							if (this.commonTopCommit) {
								return this.commonTopCommit
							} else {
								return null
							}
						})
						.then((secondCommit) => {
							this.setState(Object.assign({}, this.state, {
								shaA: this.remoteTopCommit.sha(),
								shaB: secondCommit && secondCommit.sha(),
							}))
						})
				}
			})
			.catch((error) => {
				log.error(error)
			})
			.then(() => {
				this.setUpdating(false)
			})
	}

	accept() {
		if (!this.repo || !this.remoteTopCommit) {
			return
		}
		this.setUpdating(true)
		Promise.resolve()
			.then(() => this.merge())
			.catch((error) => {
				log.error(error)
			})
			.then((success) => {
				this.setUpdating(false)
				if (success) {
					if (typeof success === 'string') {
						hashHistory.push(`/commitDetail/${success}`)
					} else {
						hashHistory.push('/history')
					}
				} else {
					this.refresh()
				}
			})

	}


	merge() {
		const author = this.repo.defaultSignature()
		return Promise.resolve()
			.then((commit) => nodegit.Reset(this.repo, this.localTopCommit, nodegit.Reset.TYPE.MIXED))
			.then(() => {
				return this.repo.mergeBranches(this.localBranch, this.remoteBranch, author)
					.catch((index) => {
						if (typeof index === 'object' && index.hasConflicts && index.hasConflicts()) {
							return this.solveConflict(index)
						} else {
							// Actually it is not an index
							console.warn(error)
							console.info('Trying to exec `git merge origin/master --allow-unrelated-histories`')
							return exec(`cd ${this.props.projects.active.path} && git merge origin/master --allow-unrelated-histories`)
								.catch((error) => {
									console.info('Exec `git merge ...` has failed. Reverting.')
									this.props.actions.status.addStatus(
										t(this.props.settings.language, 'integrate_conflict_fail')
									)
									return exec(`cd ${this.props.projects.active.path} && git merge --abort`)
										.then(() => {
											throw error
										})
								})
						}
					})
			})
			.then(() => {
				this.props.actions.status.addStatus(
					t(this.props.settings.language, 'integrate_merged')
				)
				return true
			})
	}


	solveConflict(index) {
		const author = this.repo.defaultSignature()
		return Promise.resolve()
			.then(() => this.repo.mergeBranches(this.localBranch, this.remoteBranch, author, null, {
				fileFavor: nodegit.Merge.FILE_FAVOR.THEIRS,
			}))
			.then((oid) => {
				this.props.actions.status.addStatus(
					t(this.props.settings.language, 'integrate_check_deleted')
				)
				return this.repo.getCommit(oid)
			})
			.then((commit) => {
				return nodegit.Reset(this.repo, commit, nodegit.Reset.TYPE.HARD)
					.then(() => commit.sha())
			})
	}


	render() {
		return (
			e(
				'div',
				null,
				e(
					'div',
					null,
					e('h1', null, t(this.props.settings.language, 'integrate_title')),
					e(
						RaisedButton,
						{
							label: t(this.props.settings.language, 'integrate_accept'),
							secondary: true,
							onTouchTap: this.accept.bind(this),
							disabled: this.state.updating,
							style: {
								position: 'relative',
								top: -7,
							},
						}
					),
					e(
						IconButton,
						{
							tooltip: t(this.props.settings.language, 'integrate_refres'),
							onTouchTap: this.refresh.bind(this),
							disabled: this.state.updating,
						},
						e(RefreshIcon)
					)
				),
				e(
					'div',
					{
						style: {
							marginTop: 20,
						},
					},
					e(
						Diff,
						{
							shaA: this.state.shaA,
							shaB: this.state.shaB,
						}
					)
				)
			)
		)
	}
}


function mapStateToProps(state) {
	return {
		loading: state.loading,
		projects: state.projects,
		settings: state.settings,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			integrator: bindActionCreators(IntegratorActions, dispatch),
			loading: bindActionCreators(LoadingActions, dispatch),
			status: bindActionCreators(StatusActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(IntegrateChanges)
