const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const RefreshIcon = require('material-ui/svg-icons/navigation/refresh').default
const SelectAllIcon = require('material-ui/svg-icons/content/select-all').default
const nodegit = require('../utils/nodegit').nodegit
const RaisedButton = require('material-ui/RaisedButton').default
const TextField = require('material-ui/TextField').default
const IconButton = require('material-ui/IconButton').default
const LoadingActions = require('../actions/loading')
const ProjectsActions = require('../actions/projects')
const IntegratorActions = require('../actions/integrator')
const StatusActions = require('../actions/status')
const exec = require('child-process-promise').exec
const Diff = require('./Diff')
const status = require('../utils/status')
const t = require('../utils/text')
const Checkbox = require('material-ui/Checkbox').default
const hashHistory = require('react-router').hashHistory
const log = require('../utils/log')

class Commit extends Component {

	constructor(props) {
		super(props)

		this.state = {
			trackedStaged: [],
			trackedUnstaged: [],
			untracked: [],
			artifacts: [],
			refreshing: false,
			updating: false,
			commitMessage: '',
			commiting: false,
			previewCommit: null,
			previewParentCommit: null,
		}

		this.repo = null
	}


	getDeltaStatusKey(num) {
		if (num === nodegit.Diff.DELTA.UNMODIFIED) return status.UNMODIFIED
		if (num === nodegit.Diff.DELTA.ADDED) return status.ADDED
		if (num === nodegit.Diff.DELTA.DELETED) return status.DELETED
		if (num === nodegit.Diff.DELTA.MODIFIED) return status.MODIFIED
		if (num === nodegit.Diff.DELTA.RENAMED) return status.RENAMED
		if (num === nodegit.Diff.DELTA.COPIED) return status.COPIED
		if (num === nodegit.Diff.DELTA.IGNORED) return status.IGNORED
		if (num === nodegit.Diff.DELTA.UNTRACKED) return status.UNTRACKED
		if (num === nodegit.Diff.DELTA.TYPECHANGE) return status.TYPECHANGE
		if (num === nodegit.Diff.DELTA.UNREADABLE) return status.UNREADABLE
		if (num === nodegit.Diff.DELTA.CONFLICTED) return status.CONFLICTED
	}


	getStatusKeys(artifact) {
		const keys = []

		if (artifact.isNew()) { keys.push(status.ADDED) }
		if (artifact.isModified()) { keys.push(status.MODIFIED) }
		if (artifact.isTypechange()) { keys.push(status.TYPECHANGE) }
		if (artifact.isRenamed()) { keys.push(status.RENAMED) }
		if (artifact.isIgnored()) { keys.push(status.IGNORED) }
		if (artifact.isDeleted()) { keys.push(status.DELETED) }

		return keys
	}


	stage(path) {
		this.setUpdating(true)
		return Promise.resolve()
			.then(() => exec(`cd ${this.props.projects.active.path} && git add "${path}"`))
			.catch((error) => {
				log.error(error)
			})
			.then(() => {
				this.setUpdating(false)
				this.refresh()
			})
	}


	unstage(path) {
		this.setUpdating(true)
		return Promise.resolve()
			.then(() => exec(`cd ${this.props.projects.active.path} && git reset HEAD "${path}"`))
			.catch((error) => {
				log.error(error)
			})
			.then(() => {
				this.setUpdating(false)
				this.refresh()
			})
	}


	selectAll() {
		let index
		this.setUpdating(true)
		this.repo.index()
			.then((idx) => {
				index = idx
				return index.addAll()
			})
			.then(() => {
				return index.write()
			})
			.catch((e) => {
				log.error(e)
			})
			.then(() => {
				this.setUpdating(false)
				this.refresh()
			})
	}

	unselectAll() {
		this.repo.getHeadCommit()
			.then((head) => {
				return nodegit.Reset.reset(this.repo, head, nodegit.Reset.TYPE.MIXED)
			})
			.catch((e) => {
				log.error(e)
			})
			.then(() => {
				this.setUpdating(false)
				this.refresh()
			})
	}


	renderItems(artifacts, staged, clickCallback) {
		return artifacts.map((artifact, i) => {
			return (
				e(
					'div',
					{
						className: 'commit-wrapper',
						key: i,
					},
					e(
						'button',
						{
							className: `commit-in ${staged && 'commit-full'}`,
							onTouchTap: () => clickCallback(artifact.path),
						},
						e(
							Checkbox,
							{
								checked: staged,
								label: e(
									'div',
									null,
									`${artifact.path} `,
									e(
										'span',
										{
											className: 'commit-status',
										},
										'(' + t(this.props.settings.language, `status_${artifact.status}`) + ')'
									)
								)
							}
						)
					)
				)
			)
		})
	}


	renderArtifacts() {
		const trackedStaged = this.renderItems(this.state.trackedStaged, true, this.unstage.bind(this))
		const trackedUnstaged = this.renderItems(this.state.trackedUnstaged, false, this.stage.bind(this))
		const untracked = this.renderItems(this.state.untracked, false, this.stage.bind(this))

		if (trackedStaged.length + trackedUnstaged.length + untracked.length === 0) {
			return (
				e(
					'div',
					{
						style: {
							textAlign: 'center',
						},
					},
					t(this.props.settings.language, 'commit_nothing_to_do')
				)
			)
		}

		return [
			e(
				'div',
				{
					key: 'trackedStaged',
				},
				e(
					'h3',
					{
						className: 'commit-label',
					},
					t(this.props.settings.language, 'commit_staged_label')
				),
				trackedStaged.length === 0 ? e(
					'div',
					null,
					'Vyberte alespoň jeden soubor.'
				) : trackedStaged
			),
			this.isAllStaged() ? null : e(
				'div',
				{
					key: 'unstaged',
				},
				e(
					'h3',
					{
						className: 'commit-label',
					},
					t(this.props.settings.language, 'commit_unstaged_label')
				),
				e(
					'div',
					{
						key: 'trackedUnstaged',
					},
					trackedUnstaged
				),
				e(
					'div',
					{
						key: 'untracked',
					},
					untracked
				)
			)
		]
	}

	getBody() {
		if (this.props.projects.active) {
			return (
				e(
					'div',
					null,
					e(
						'div',
						{
							style: {
								textAlign: 'center',
								marginBottom: 20,
							},
						},
						e(
							IconButton,
							{
								tooltip: t(this.props.settings.language, !this.isAllStaged() ? 'commit_select_all' : 'commit_unselect_all'),
								onTouchTap: !this.isAllStaged() ? this.selectAll.bind(this) : this.unselectAll.bind(this),
								disabled: this.state.refreshing || this.state.updating
							},
							e(SelectAllIcon)
						),
						e(
							IconButton,
							{
								tooltip: t(this.props.settings.language, 'commit_refresh'),
								onTouchTap: this.refresh.bind(this),
								disabled: this.state.refreshing || this.state.updating,
							},
							e(RefreshIcon)
						)
					),

					e(
						'div',
						{
							style: {
								opacity: (this.state.refreshing || this.state.updating) ? 0.5 : 1,
								transition: 'opacity 0.3s',
							},
						},
						this.renderArtifacts()
					),

					e(
						'div',
						{
							style: {
								marginTop: 20,
								textAlign: 'center',
							}
						},
						e(
							TextField,
							{
								hintText: t(this.props.settings.language, 'commit_message_hint'),
								multiLine: true,
								onChange: this.handleCommitMessageChange.bind(this),
								value: this.state.commitMessage,
							}
						),
						e(
							RaisedButton,
							{
								label: t(this.props.settings.language, 'commit_save'),
								secondary: true,
								onTouchTap: this.commit.bind(this),
								disabled: this.state.commiting || this.isAllUnstaged(),
							}
						)
					),
					this.state.previewCommit && this.state.previewParentCommit && e(
						'div',
						null,
						e(
							'h2',
							null,
							t(this.props.settings.language, 'commit_detail')
						),
						e(
							Diff,
							{
								shaA: this.state.previewCommit.sha(),
								shaB: this.state.previewParentCommit.sha(),
							}
						)
					)
				)
			)
		} else {
			return (
				e(
					'div',
					null,
					t(this.props.settings.language, 'commit_no_project')
				)
			)
		}

	}


	isAllUnstaged() {
		return this.state.trackedStaged.length === 0
	}


	isAllStaged() {
		return this.state.trackedUnstaged.length + this.state.untracked.length === 0
	}


	handleCommitMessageChange(e, commitMessage) {
		this.setCommitMesage(commitMessage)
	}

	setCommitMesage(commitMessage) {
		this.setState(Object.assign({}, this.state, {
			commitMessage,
		}))
	}

	commit() {
		this.setCommiting(true)
		let oid
		this.repo.refreshIndex()
			.then((index) => {
				return index.writeTree()
			})
			.then((oidResult) => {
				oid = oidResult
				return nodegit.Reference.nameToId(this.repo, 'HEAD')
					.then((head) => {
						return this.repo.getCommit(head)
					})
					.catch((error) => {
						log.error(error)
						log.info('Faking no parent')
						return null
					})
			})
			.then((parent) => {
				const author = this.repo.defaultSignature()
				const parents = []
				if (parent) {
					parents.push(parent)
				}
				return this.repo.createCommit('HEAD', author, author, this.state.commitMessage, oid, parents)
			})
			.then(() => {
				this.setCommitMesage('')
				this.refresh()
				this.props.actions.status.addStatus(
					t(this.props.settings.language, 'commit_created')
				)
			})
			.catch((e) => {
				log.error(e)
			})
			.then(() => {
				this.setCommiting(false)
			})
	}

	setRefreshing(refreshing) {
		this.setState(Object.assign({}, this.state, { refreshing }))
		if (refreshing) {
			this.props.actions.loading.IncrementLoadingJobs()
		} else {
			this.props.actions.loading.DecrementLoadingJobs()
		}
	}

	setCommiting(commiting) {
		this.setState(Object.assign({}, this.state, { commiting }))
		if (commiting) {
			this.props.actions.loading.IncrementLoadingJobs()
		} else {
			this.props.actions.loading.DecrementLoadingJobs()
		}
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
		this.props.actions.integrator.dismissCommitNotification()
	}

	getUnstaged(repo) {
		return nodegit.Diff.indexToWorkdir(repo, null, {
			flags: nodegit.Diff.OPTION.SHOW_UNTRACKED_CONTENT,
		})
			.then((diff) => {
				const tracked = []
				const untracked = []
				for (let i = 0; i < diff.numDeltas(); i++) {
					const delta = diff.getDelta(i)
					const oldPath = delta.oldFile().path()
					const newPath = delta.newFile().path()
					const statusPath = oldPath || newPath
					if (delta.status() === nodegit.Diff.DELTA.UNTRACKED) {
						untracked.push(this.getArtifactForm(
							statusPath,
							status.ADDED
						))
					} else {
						tracked.push(this.getArtifactForm(
							statusPath,
							this.getDeltaStatusKey(delta.status())
						))
					}
				}
				return {
					tracked,
					untracked,
				}
			})
	}


	getArtifactForm(path, status) {
		return {
			path,
			status,
		}
	}


	getStaged(repo) {
		return repo.getStatus()
			.then((artifacts) => {
				return artifacts.filter((artifact) => {
						return artifact.inIndex()
					}).map((artifact) => {
						return this.getArtifactForm(
							artifact.path(),
							this.getStatusKeys(artifact)[0]
						)
					})
			})
	}

	refresh() {
		this.setRefreshing(true)
		let staged
		let unstaged
		let previewCommit = null
		let previewParentCommit = null
		nodegit.Repository.open(this.props.projects.active.path)
			.then((repo) => this.repo = repo)
			.then(() => this.getStaged(this.repo))
			.then((x) => staged = x)
			.then(() => this.getUnstaged(this.repo))
			.then((x) => unstaged = x)
			.then(() => {
				this.setState(Object.assign({}, this.state, {
					trackedStaged: staged,
					trackedUnstaged: unstaged.tracked,
					untracked: unstaged.untracked,
				}))
			})
			.then(() => {
				if (!this.isAllUnstaged()) {
					let oid
					return this.repo.refreshIndex()
						.then((index) => index.writeTree())
						.then((o) => oid = o)
						.then(() => nodegit.Reference.nameToId(this.repo, 'HEAD'))
						.then((head) => this.repo.getCommit(head))
						.then((parent) => {
							const author = this.repo.defaultSignature()
							const parents = []
							if (parent) {
								previewParentCommit = parent
								parents.push(parent)
							}
							return this.repo.createCommit(null, author, author, '', oid, parents)
						})
						.then((commitOid) => {
							return nodegit.Commit.lookup(this.repo, commitOid)
								.then((commit) => {
									if (commit) {
										previewCommit = commit
									}
								})
						})
				}
			})
			.catch((e) => {
				log.error(e)
			})
			.then(() => {
				this.setRefreshing(false)
				if (previewCommit !== this.state.previewCommit) {
					this.setState(Object.assign({}, this.state, { previewCommit, previewParentCommit }))
				}

				if (this.state.trackedStaged.length + this.state.trackedUnstaged.length + this.state.untracked.length === 0) {
					hashHistory.push('/history')
				}
			})
	}

	render() {
		return (
			e(
				'div',
				null,
				e('h1', null, 'Commit'),
				this.getBody()
			)
		)
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
			loading: bindActionCreators(LoadingActions, dispatch),
			projects: bindActionCreators(ProjectsActions, dispatch),
			status: bindActionCreators(StatusActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Commit)
