const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const nodegit = require('../utils/nodegit').nodegit
const LoadingActions = require('../actions/loading')

class Contributors extends Component {

	constructor(props) {
		super(props)

		this.state = {
			contributors: [],
		}
	}

	componentDidMount() {
		this.refresh()
	}

	refresh() {
		const contributors = []
		const emails = []
		this.props.actions.loading.IncrementLoadingJobs()

		const processCommit = (commit) => {
			const author = commit.author()
			if (emails.indexOf(author.email()) === -1) {
				emails.push(author.email())
				contributors.push({
					email: author.email(),
					name: author.name(),
				})
			}

			if (commit.parentcount() === 0) {
				return
			} else {
				return commit.getParents()
					.then((parents) => {
						return Promise.all(parents.map((parent) => {
							return processCommit(parent)
						}))
					})
			}
		}

		nodegit.Repository.open(this.props.project.path)
			.then((repo) => repo.getHeadCommit())
			.then((commit) => {
				return processCommit(commit)
			})
			.then(() => {
				this.setState(Object.assign({}, this.state, {
					contributors,
				}))
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				this.props.actions.loading.DecrementLoadingJobs()
			})
	}

	renderList() {
		return this.state.contributors.map((contributor, i) => {
			return e(
				'div',
				{
					key: contributor.email,
				},
				`${contributor.name} <${contributor.email}>`
			)
		})
	}

	render() {

		return (
			e(
				'div',
				null,
				e('h2', null, 'Autoři'),
				this.renderList()
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
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Contributors)
