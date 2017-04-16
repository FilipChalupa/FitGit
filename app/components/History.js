const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const LoadingActions = require('../actions/loading')
const nodegit = require('../utils/nodegit').nodegit
const hashHistory = require('react-router').hashHistory

const LIMIT = 250

class History extends Component {

	constructor(props) {
		super(props)

		this.state = {
			tree: [],
		}
	}


	componentDidMount() {
		this.refresh()
	}


	refresh() {
		this.props.actions.loading.IncrementLoadingJobs()
		const tree = []
		let commitsPool = []
		let nextIsRemote = false
		let nextIsLocal = false

		const processPool = () => {
			if (commitsPool.length === 0 || tree.length === LIMIT) { // @TODO: note to user that limit was reached
				return
			}
			let nextCommit = commitsPool.reduce((accumulator, current) => {
				if (accumulator.commit.timeMs() < current.commit.timeMs()) {
					return current
				}
				return accumulator
			})
			commitsPool = commitsPool.filter((commit) => {
				if (commit.commit.sha() === nextCommit.commit.sha()) {
					if (commit.branch === 'remote') {
						nextIsRemote = true
					} else if (commit.branch === 'local') {
						nextIsLocal = true
					}
					return false
				} else {
					return true
				}
			})
			if (nextIsRemote && nextIsLocal) {
				nextCommit.branch = 'common'
			}
			return nextCommit.commit.getParents()
				.then((parents) => {
					tree.push({
						branch: nextCommit.branch,
						message: nextCommit.commit.message().trim(),
						sha: nextCommit.commit.sha(),
						isMergeCommit: parents.length > 1,
					})
					commitsPool = commitsPool.concat(parents.map((commit) => {
						return {
							commit,
							branch: nextCommit.branch,
						}
					}))
					return processPool()
				})
		}

		let repo
		const getTopCommit = (reference, branch) => {
			return repo.getBranchCommit(reference)
				.then((commit) => commitsPool.push({
					commit,
					branch,
				}))
				.then(() => reference)
		}

		nodegit.Repository.open(this.props.projects.active.path)
			.then((r) => {
				repo = r
				return repo.getCurrentBranch()
			})
			.then((reference) => getTopCommit(reference, 'local'))
			.then((branch) => nodegit.Branch.upstream(branch))
			.then((reference) => getTopCommit(reference, 'remote'))
			.catch((error) => {
				console.error(error)
			})
			.then(() => processPool())
			.then(() => {
				this.setState(Object.assign({}, this.state, {
					tree,
				}))
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				this.props.actions.loading.DecrementLoadingJobs()
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
				e(
					'div',
					{
						className: 'history-titles',
					},
					e(
						'h2',
						{
							className: 'history-title',
						},
						'Sdílené změny'
					),
					e(
						'h2',
						{
							className: 'history-title',
						},
						'Vaše nezazálohované změny'
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
				this.renderTree()
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
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(History)
