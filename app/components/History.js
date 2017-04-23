const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const LoadingActions = require('../actions/loading')
const n = require('../utils/nodegit')
const nodegit = n.nodegit
const getNewestCommitFromPool = n.getNewestCommitFromPool
const hashHistory = require('react-router').hashHistory
const RaisedButton = require('material-ui/RaisedButton').default
const IconButton = require('material-ui/IconButton').default
const RefreshIcon = require('material-ui/svg-icons/navigation/refresh').default
const remoteCallbacks = require('../utils/remoteCallbacks')
const log = require('../utils/log')
const t = require('../utils/text')

const LIMIT = 250

class History extends Component {

	constructor(props) {
		super(props)

		this.state = {
			refreshing: false,
			tree: [],
			countLocal: 0,
			countRemote: 0,
			countCommon: 0,
		}
	}


	componentDidMount() {
		this.refresh()
	}


	setRefreshing(refreshing) {
		this.setState(Object.assign({}, this.state, { refreshing }))
		if (refreshing) {
			this.props.actions.loading.IncrementLoadingJobs()
		} else {
			this.props.actions.loading.DecrementLoadingJobs()
		}
	}


	push() {
		this.setRefreshing(true)
		let repo
		let localBranchReference
		nodegit.Repository.open(this.props.projects.active.path)
			.then((r) => {
				repo = r
				return repo.getCurrentBranch()
			})
			.then((reference) => {
				localBranchReference = reference
				return nodegit.Branch.upstream(localBranchReference)
			})
			.then((reference) => {
				const remoteName = reference.toString().split('/')[2] // Returns for example "origin"
				return repo.getRemote(remoteName)
			})
			.then((remote) => {
				const refName = localBranchReference.toString()
				return remote.push([
					`${refName}:${refName}`
				], remoteCallbacks)
			})
			.catch((error) => {
				log.error(error)
			})
			.then(() => {
				this.setRefreshing(false)
				this.refresh()
			})
	}

	clearDoubleCrossing(tree) {
		const top = []
		const common = []
		tree.forEach((commit) => {
			if (commit.branch === 'common') {
				common.push(commit)
			} else {
				top.push(commit)
			}
		})
		return top.concat(common)
	}


	refresh() {
		if (!this.props.projects.active) {
			hashHistory.push('/projects')
			return
		}
		this.setRefreshing(true)
		const tree = []
		let commitsPool = []
		const count = {
			local: 0,
			remote: 0,
			common: 0,
		}

		const processPool = () => {
			if (commitsPool.length === 0 || tree.length === LIMIT) {
				return Promise.resolve()
			}

			const nextCommit = getNewestCommitFromPool(commitsPool)

			commitsPool = commitsPool.filter((commit) => {
				if (commit.commit.sha() === nextCommit.commit.sha()) {
					nextCommit.isRemote = nextCommit.isRemote || commit.isRemote
					nextCommit.isLocal = nextCommit.isLocal || commit.isLocal
					return false
				} else {
					return true
				}
			})

			const branch = nextCommit.isLocal && nextCommit.isRemote ? 'common' : nextCommit.isLocal ? 'local' : 'remote'
			count[branch]++
			return nextCommit.commit.getParents()
				.then((parents) => {
					tree.push({
						branch,
						message: nextCommit.commit.message().trim(),
						sha: nextCommit.commit.sha(),
						isMergeCommit: parents.length > 1,
					})
					commitsPool = commitsPool.concat(parents.map((commit) => {
						return makeCommitForPool(commit, nextCommit.isLocal, nextCommit.isRemote)
					}))
					return processPool()
				})
		}

		const makeCommitForPool = (commit, isLocal, isRemote) => {
			return {
				commit,
				isLocal,
				isRemote,
			}
		}

		let repo
		const getTopCommit = (reference, isLocal, isRemote) => {
			return repo.getBranchCommit(reference)
				.then((commit) => commitsPool.push(makeCommitForPool(commit, isLocal, isRemote)))
				.then(() => reference)
		}

		nodegit.Repository.open(this.props.projects.active.path)
			.then((r) => {
				repo = r
				return repo.getCurrentBranch()
			})
			.then((reference) => getTopCommit(reference, true, false))
			.then((branch) => nodegit.Branch.upstream(branch))
			.then((reference) => getTopCommit(reference, false, true))
			.catch((error) => {
				log.error(error)
			})
			.then(() => processPool())
			.then(() => {
				this.setState(Object.assign({}, this.state, {
					tree: this.clearDoubleCrossing(tree),
					countLocal: count.local,
					countRemote: count.remote,
					countCommon: count.common,
				}))
			})
			.catch((error) => {
				log.error(error)
			})
			.then(() => {
				this.setRefreshing(false)
			})
	}


	renderTree() {
		let lineRemote = false
		let lineLocal = false

		return (
			e(
				'div',
				{
					className: 'history-tree',
				},
				this.state.countLocal === 0 ? null : e(
					'div',
					{
						className: 'history-titles',
					},
					e(
						'h2',
						{
							className: 'history-title',
						},
						t(this.props.settings.language, 'history_shared')
					),
					e(
						'h2',
						{
							className: 'history-title',
						},
						t(this.props.settings.language, 'history_shared_not')
					)
				),
				this.state.tree.map((node, i) => {
					const lineClasses = ['history-line']
					if (node.branch === 'common') {
						lineClasses.push('history-line-common')
					} else {
						if (node.branch === 'local') {
							lineLocal = true
						} else if (node.branch === 'remote') {
							lineRemote = true
						}
						if (lineRemote) {
							lineClasses.push('history-line-remote')
						}
						if (lineLocal) {
							lineClasses.push('history-line-local')
							if (this.state.tree[i+1] && this.state.tree[i+1].branch === 'common') {
								lineClasses.push('history-line-merge')
							}
						}
					}
					if (i === this.state.tree.length-1) {
						lineClasses.push('history-line-last')
					}
					const nodeClasses = ['history-node', `history-node-${node.branch}`]
					if (node.isMergeCommit) {
						nodeClasses.push('history-node-mergeCommit')
					}
					const message = node.message.split('\n')
					return e(
						'div',
						{
							key: i,
							className: nodeClasses.join(' '),
						},
						e(
							'div',
							{
								className: lineClasses.join(' '),
							},
							e(
								'span',
								{
									className: 'history-line-in',
								}
							)
						),
						e(
							'button',
							{
								className: 'history-node-in',
								onClick: () => {
									hashHistory.push(`/commitDetail/${node.sha}`)
								},
							},
							message[0] + (message.length > 1 ? '…' : '')
						)
					)
				})
			)
		)
	}

	render() {
		return (
			e(
				'div',
				null,
				e('h1', null, 'Historie'),
				e(
					'div',
					null,
					(this.props.settings.autoPush || this.state.countRemote !== 0 || this.state.countLocal === 0) ? null : e(
						RaisedButton,
						{
							label: t(this.props.settings.language, 'history_share'),
							secondary: true,
							onTouchTap: () => this.push(),
							disabled: this.state.refreshing,
							style: {
								position: 'relative',
								top: -7,
							},
						}
					),
					e(
						IconButton,
						{
							tooltip: t(this.props.settings.language, 'history_refresh'),
							onTouchTap: this.refresh.bind(this),
							disabled: this.state.refreshing,
						},
						e(RefreshIcon)
					)
				),
				this.renderTree()
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
			loading: bindActionCreators(LoadingActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(History)
