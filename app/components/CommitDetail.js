const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const LoadingActions = require('../actions/loading')
const Diff = require('./Diff')
const nodegit = require('../utils/nodegit').nodegit
const nl2br = require('react-nl2br')
const Time = require('./Time')
const gravatar = require('gravatar')
const Avatar = require('material-ui/Avatar').default
const c = require('material-ui/Card')
const Card = c.Card
const CardHeader = c.CardHeader
const MenuActions = require( '../actions/menu')

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
		this.props.actions.menu.setAction('Historie', '/history')
	}


	componentWillUnmount() {
		this.props.actions.menu.unsetAction()
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
		if (this.state.parentCommits.length <= 1) {
			return e(
				Diff,
				{
					shaA: this.state.mainCommit.sha(),
					shaB: this.state.parentCommits[0] && this.state.parentCommits[0].sha(),
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


	getNote() {
		if (!this.state.mainCommit) {
			return null
		}
		const author = this.state.mainCommit.author()
		const date = this.state.mainCommit.date()
		return (
			e(
				Card,
				{
					className: 'commitDetail-note',
				},
				e(
					CardHeader,
					{
						title: author.toString(),
						subtitle: e(
							Time,
							{
								date,
							}
						),
						avatar: gravatar.url(author.email(), {protocol: 'https', s: '80', r: 'pg', d: 'mm'}),
					}
				)
			)
		)
	}


	render() {
		const message = this.state.mainCommit ? this.state.mainCommit.message().split('\n') : null
		const commitHash = this.state.mainCommit ? this.state.mainCommit.sha() : null
		return (
			e(
				'div',
				null,
				e(
					'h1',
					null,
					message ? message[0] : 'Detail commitu'
				),
				e(
					'p',
					{
						className: 'commitDetail-hash',
					},
					`Unikátní identifikátor: ${commitHash}`
				),
				(!message || message.length <= 1) ? null : e(
					'h3',
					null,
					nl2br(message.slice(1).join('\n'))
				),
				this.getNote(),
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
			menu: bindActionCreators(MenuActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(CommitDetail)
