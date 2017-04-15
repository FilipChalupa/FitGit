const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const LoadingActions = require('../actions/loading')
const Diff = require('./Diff')
const nodegit = require('../utils/nodegit').nodegit

class CommitDetail extends Component {

	constructor(props) {
		super(props)

		this.state = {
			mainCommit: null,
			parentCommits: [],
		}
	}


	componentDidMount() {
		this.refresh()
	}


	refresh() {
		this.props.actions.loading.IncrementLoadingJobs()

		let mainCommit
		let parentCommits = []
		nodegit.Repository.open(this.props.projects.active.path)
			.then((repo) => repo.getCommit(this.props.sha))
			.then((commit) => {
				mainCommit = commit
				return commit.getParents()
			})
			.then((parents) => {
				parentCommits = parents
				this.setState(Object.assign({}, this.state, {
					mainCommit,
					parentCommits,
				}))
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				this.props.actions.loading.DecrementLoadingJobs()
			})
	}


	getDiffs() {
		if (!this.state.mainCommit || !this.state.parentCommits) {
			return null
		}
		if (this.state.parentCommits.length === 1) {
			return e(
				Diff,
				{
					shaA: this.state.mainCommit.sha(),
					shaB: this.state.parentCommits[0].sha(),
				}
			)
		} else {
			return this.state.parentCommits.map((parentCommit) => {
				return (
					e(
						'div',
						{
							key: parentCommit.sha()
						},
						e(
							'h2',
							null,
							`Porovnání s „${parentCommit.message()}“`
						),
						e(
							Diff,
							{
								shaA: this.state.mainCommit.sha(),
								shaB: parentCommit.sha(),
							}
						)
					)
				)
			})
		}
	}


	render() {
		return (
			e(
				'div',
				null,
				e(
					'h1',
					null,
					this.state.mainCommit ? this.state.mainCommit.message() : 'Detail commitu'
				),
				this.getDiffs()
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(CommitDetail)
