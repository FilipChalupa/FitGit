const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const n = require('../utils/nodegit')
const nodegit = n.nodegit
const countCommitStats = n.countCommitStats
const LoadingActions = require('../actions/loading')
const ProjectsActions = require('../actions/projects')
const CircularProgress = require('material-ui/CircularProgress').default

class Contributors extends Component {

	constructor(props) {
		super(props)

		this.state = {
			additions: 0,
			removals: 0,
			files: 0,
			loading: false,
		}
	}

	componentDidMount() {
		this.refresh()
	}


	setLoading(loading) {
		this.setState(Object.assign({}, this.state, { loading }))
		if (loading) {
			this.props.actions.loading.IncrementLoadingJobs()
		} else {
			this.props.actions.loading.DecrementLoadingJobs()
		}
	}


	refresh() {
		let commitsPool = []
		const additions = []
		const removals = []
		const files = []
		this.setLoading(true)

		const processPool = () => {
			if (commitsPool.length === 0) {
				return Promise.resolve()
			}

			const nextCommit = commitsPool.reduce((accumulator, current) => {
				if (accumulator.timeMs() < current.timeMs()) {
					return current
				}
				return accumulator
			})
			commitsPool = commitsPool.filter((commit) => commit.sha() !== nextCommit.sha())

			return nextCommit.getParents()
				.then((parents) => {
					commitsPool = commitsPool.concat(parents)
					if (parents.length === 1) {
						let treeA
						return Promise.resolve()
							.then(() => nextCommit.getTree())
							.then((tree) => treeA = tree)
							.then(() => nextCommit.getParents())
							.then((parents) => parents[0] && parents[0].getTree())
							.then((treeB) => countCommitStats(treeA, treeB))
							.then((stats) => {
								if (stats) {
									additions.push(stats.additions)
									removals.push(stats.removals)
									files.push(stats.files)
								}
							})
					}
				})
				.then(() => processPool())
		}

		nodegit.Repository.open(this.props.project.path)
			.then((repo) => repo.getHeadCommit())
			.then((commit) => {
				if (commit) {
					commitsPool.push(commit)
					return processPool()
						.then(() => {
							// Get medians
							additions.sort()
							removals.sort()
							files.sort()
							const additionsMedia = additions[Math.floor(additions.length/2)]
							const removalsMedia = removals[Math.floor(removals.length/2)]
							const filesMedia = files[Math.floor(files.length/2)]
							this.props.actions.projects.updateProjectStats(
								this.props.project,
								additionsMedia,
								removalsMedia,
								filesMedia
							)
							this.setState(Object.assign({}, this.state, {
								additions: additionsMedia,
								removals: removalsMedia,
								files: filesMedia,
							}))
						})
				}
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				this.setLoading(false)
			})
	}

	renderDetail() {
		return e(
			'div',
			{
				className: 'typicalCommit-detail',
			},
			e(
				'h3',
				{
					className: 'typicalCommit-detail-title',
				},
				'Počet přidaných řádků'
			),
			e(
				'p',
				{
					className: 'typicalCommit-detail-value',
				},
				this.state.additions
			),
			e(
				'h3',
				{
					className: 'typicalCommit-detail-title',
				},
				'Počet odebraných řádků'
			),
			e(
				'p',
				{
					className: 'typicalCommit-detail-value',
				},
				this.state.removals
			),
			e(
				'h3',
				{
					className: 'typicalCommit-detail-title',
				},
				'Počet změněných souborů'
			),
			e(
				'p',
				{
					className: 'typicalCommit-detail-value',
				},
				this.state.files
			)
		)
	}

	render() {

		return (
			e(
				'div',
				{
					className: 'typicalCommit',
				},
				e('h2', null, 'Běžný commit (střední hodnota)'),
				this.state.loading ? e(CircularProgress) : this.renderDetail()
			)
		)
	}
}


function mapStateToProps(state) {
	return {
		loading: state.loading,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			loading: bindActionCreators(LoadingActions, dispatch),
			projects: bindActionCreators(ProjectsActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Contributors)
