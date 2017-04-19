const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const FlatButton = require('material-ui/FlatButton').default
const RefreshIcon = require('material-ui/svg-icons/navigation/refresh').default
const NewIcon = require('material-ui/svg-icons/av/fiber-new').default
const SelectAllIcon = require('material-ui/svg-icons/content/select-all').default
const nodegit = require('../utils/nodegit').nodegit
const RaisedButton = require('material-ui/RaisedButton').default
const TextField = require('material-ui/TextField').default
const LoadingActions = require('../actions/loading')
const ProjectsActions = require('../actions/projects')
const StatusActions = require('../actions/status')
const exec = require('child-process-promise').exec

const STATUS_UNMODIFIED = 'unmodified'
const STATUS_ADDED = 'added'
const STATUS_DELETED = 'deleted'
const STATUS_MODIFIED = 'modified'
const STATUS_RENAMED = 'renamed'
const STATUS_COPIED = 'copied'
const STATUS_IGNORED = 'ignored'
const STATUS_UNTRACKED = 'untracked'
const STATUS_TYPECHANGE = 'typechange'
const STATUS_UNREADABLE = 'unreadable'
const STATUS_CONFLICTED = 'conflicted'

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
		}

		this.repo = null
	}


	getDeltaStatusKey(num) {
		if (num === nodegit.Diff.DELTA.UNMODIFIED) return STATUS_UNMODIFIED
		if (num === nodegit.Diff.DELTA.ADDED) return STATUS_ADDED
		if (num === nodegit.Diff.DELTA.DELETED) return STATUS_DELETED
		if (num === nodegit.Diff.DELTA.MODIFIED) return STATUS_MODIFIED
		if (num === nodegit.Diff.DELTA.RENAMED) return STATUS_RENAMED
		if (num === nodegit.Diff.DELTA.COPIED) return STATUS_COPIED
		if (num === nodegit.Diff.DELTA.IGNORED) return STATUS_IGNORED
		if (num === nodegit.Diff.DELTA.UNTRACKED) return STATUS_UNTRACKED
		if (num === nodegit.Diff.DELTA.TYPECHANGE) return STATUS_TYPECHANGE
		if (num === nodegit.Diff.DELTA.UNREADABLE) return STATUS_UNREADABLE
		if (num === nodegit.Diff.DELTA.CONFLICTED) return STATUS_CONFLICTED
	}


	getStatusKeys(artifact) {
		const keys = []

		if (artifact.isNew()) { keys.push(STATUS_ADDED) }
		if (artifact.isModified()) { keys.push(STATUS_MODIFIED) }
		if (artifact.isTypechange()) { keys.push(STATUS_TYPECHANGE) }
		if (artifact.isRenamed()) { keys.push(STATUS_RENAMED) }
		if (artifact.isIgnored()) { keys.push(STATUS_IGNORED) }
		if (artifact.isDeleted()) { keys.push(STATUS_DELETED) }

		return keys
	}


	stage(path) {
		this.setUpdating(true)
		return Promise.resolve()
			.then(() => exec(`cd ${this.props.projects.active.path} && git add "${path}"`))
			.catch((error) => {
				console.error(error)
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
				console.error(error)
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
				console.error(e)
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
				console.error(e)
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
						e('span', { className: 'commit-selected' }),
						/*e(
							NewIcon,
							{
								style: {
									position: 'relative',
									top: 5,
									marginRight: 3,
									opacity: artifact.status.includes(STATUS_ADDED) ? 1 : 0,
								},
							}
						),*/
						artifact.path + ' ('+artifact.status+')'
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
					'Aktuálně nejsou v projektu žádné necommitované změny.'
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
					null,
					'Zvolené'
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
					null,
					'Nezvolené',
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
							FlatButton,
							{
								icon: e(SelectAllIcon),
								onTouchTap: !this.isAllStaged() ? this.selectAll.bind(this) : this.unselectAll.bind(this),
								disabled: this.state.refreshing || this.state.updating
							}
						),
						e(
							FlatButton,
							{
								icon: e(RefreshIcon),
								onTouchTap: this.refresh.bind(this),
								disabled: this.state.refreshing || this.state.updating,
							}
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
								hintText: 'Stručný popis změn',
								multiLine: true,
								onChange: this.handleCommitMessageChange.bind(this),
								value: this.state.commitMessage,
							}
						),
						e(
							RaisedButton,
							{
								label: 'Uložit',
								secondary: true,
								onTouchTap: this.commit.bind(this),
								disabled: this.state.commiting || this.isAllUnstaged(),
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
					'Musíte zvolit projekt.'
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
			})
			.then((head) => {
				return this.repo.getCommit(head)
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
				this.props.actions.status.addStatus('Commit byl vytvořen')
			})
			.catch((e) => {
				console.error(e)
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
							STATUS_ADDED
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
			.catch((e) => {
				console.error(e)
			})
			.then(() => {
				this.setRefreshing(false)
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
		loading: state.loading,
		projects: state.projects,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			loading: bindActionCreators(LoadingActions, dispatch),
			projects: bindActionCreators(ProjectsActions, dispatch),
			status: bindActionCreators(StatusActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Commit)
