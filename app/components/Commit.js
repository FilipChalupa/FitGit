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
const STATUS_NEW = 'new'
const STATUS_MODIFIED = 'modified'
const STATUS_TYPECHANGE = 'typechange'
const STATUS_RENAMED = 'renamed'
const STATUS_IGNORED = 'ignored'

class Commit extends Component {

	constructor(props) {
		super(props)

		this.state = {
			artifacts: [],
			refreshing: false,
			updating: false,
			commitMessage: '',
			commiting: false,
			nothingSelected: true,
			allSelected: false,
		}

		this.repo = null
	}

	getArtifacts() {
		return this.state.artifacts.map((artifact, i) => {
			return (
				e(
					'div',
					{
						className: 'commit-wrapper',
						key: artifact.path,
					},
					e(
						'button',
						{
							className: `commit-in ${artifact.inIndex && 'commit-full'}`,
							onTouchTap: () => this.updateIndex(artifact),
						},
						e('span', { className: 'commit-selected' }),
						e(
							NewIcon,
							{
								style: {
									position: 'relative',
									top: 5,
									marginRight: 3,
									opacity: artifact.status.includes(STATUS_NEW) ? 1 : 0,
								},
							}
						),
						artifact.path
					)
				)
			)
		})
	}

	updateIndex(artifact) {
		let index
		this.setUpdating(true)
		this.repo.index()
			.then((idx) => {
				index = idx
				if (artifact.inIndex) {
					return index.removeByPath(artifact.path) // @TODO: This is not the usual unstage
				} else {
					return index.addByPath(artifact.path)
				}
			})
			.then(() => {
				return index.write()
			})
			.catch((e) => {
				console.error(e)
			})
			.then(() => {
				this.setUpdating(false)
				this.refresh() // @TODO: update only changed
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
				this.refresh() // @TODO: update only changed
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
				this.refresh() // @TODO: update only changed
			})
	}

	getStatusKeys(artifact) {
		const keys = []

		if (artifact.isNew()) { keys.push(STATUS_NEW) }
		if (artifact.isModified()) { keys.push(STATUS_MODIFIED) }
		if (artifact.isTypechange()) { keys.push(STATUS_TYPECHANGE) }
		if (artifact.isRenamed()) { keys.push(STATUS_RENAMED) }
		if (artifact.isIgnored()) { keys.push(STATUS_IGNORED) }

		return keys
	}

	renderArtifacts() {
		const artifacts = this.getArtifacts()
		if (artifacts.length === 0) {
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
		return artifacts
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
								onTouchTap: this.state.allSelected ? this.unselectAll.bind(this) : this.selectAll.bind(this),
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
								disabled: this.state.commiting || this.state.nothingSelected,
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
				return this.repo.createCommit('HEAD', author, author, this.state.commitMessage, oid, [parent])
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

	refresh() {
		this.setRefreshing(true)
		nodegit.Repository.open(this.props.projects.active.path)
			.then((repo) => {
				this.repo = repo
				return repo.getStatus()
			})
			.then((artifacts) => {
				const countAll = artifacts.length
				let countSelected = 0
				this.setState(Object.assign({}, this.state, {
					artifacts: artifacts.map((artifact) => {
						if (artifact.inIndex()) {
							countSelected++
						}
						return {
							inIndex: !!artifact.inIndex(),
							path: artifact.path(),
							status: this.getStatusKeys(artifact),
						}
					}),
					nothingSelected: countSelected === 0,
					allSelected: countSelected === countAll,
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
