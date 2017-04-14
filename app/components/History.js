const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const LoadingActions = require('../actions/loading')
const nodegit = require('../utils/nodegit').nodegit

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

		const processPool = () => {
			if (commitsPool.length === 0) {
				return
			}
			let nextCommit = commitsPool.reduce((accumulator, current) => {
				if (accumulator.commit.timeMs() < current.commit.timeMs()) {
					return current
				}
				return accumulator
			})
			let nextIsRemote = false
			let nextIsLocal = false
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
			tree.push({
				branch: nextCommit.branch,
				message: nextCommit.commit.message(),
			})
			return nextCommit.commit.getParents()
				.then((parents) => {
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
			.then(nodegit.Branch.upstream)
			.then((reference) => getTopCommit(reference, 'remote'))
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
							if (this.state.tree[i+1].branch && this.state.tree[i+1].branch === 'common') {
								lineClasses.push('history-line-merge')
							}
						}
					}
					if (i === this.state.tree.length-1) {
						lineClasses.push('history-line-last')
					}
					return e(
						'div',
						{
							key: i,
							className: `history-node history-node-${node.branch}`,
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
							'div',
							{
								className: 'history-node-in',
							},
							node.message
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
