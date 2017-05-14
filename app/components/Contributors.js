const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const nodegit = require('../utils/nodegit').nodegit
const LoadingActions = require('../actions/loading')
const CircularProgress = require('material-ui/CircularProgress').default
const Time = require('./Time')
const log = require('../utils/log')
const c = require('material-ui/Card')
const Card = c.Card
const CardTitle = c.CardTitle
const CardText = c.CardText
const Avatar = require('material-ui/Avatar').default
const l = require('material-ui/List')
const List = l.List
const ListItem = l.ListItem
const gravatar = require('gravatar')
const t = require('../utils/text')

class Contributors extends Component {

	constructor(props) {
		super(props)

		this.state = {
			contributors: [],
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
		const contributors = []
		const emails = []
		let commitsPool = []
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

			const author = nextCommit.author()
			if (emails.indexOf(author.email()) === -1) {
				emails.push(author.email())
				contributors.push({
					email: author.email(),
					name: author.name(),
					timestamp: author.when().time(),
				})
			}

			return nextCommit.getParents()
				.then((parents) => commitsPool = commitsPool.concat(parents))
				.then(() => processPool())
		}

		nodegit.Repository.open(this.props.project.path)
			.then((repo) => repo.getHeadCommit())
			.then((commit) => {
				if (commit) {
					commitsPool.push(commit)
					return processPool()
						.then(() => {
							this.setState(Object.assign({}, this.state, {
								contributors,
							}))
						})
				}
			})
			.catch((error) => {
				log.error(error)
			})
			.then(() => {
				this.setLoading(false)
			})
	}

	renderList() {
		if (this.state.contributors.length === 0) {
			return e(
				CardText,
				null,
				t(this.props.settings.language, 'contributors_no_authors')
			)
		}

		return e(
			List,
			null,
			this.state.contributors.map((contributor, i) => {
				return e(
					ListItem,
					{
						key: contributor.email,
						disabled: true,
						primaryText: `${contributor.name} <${contributor.email}>`,
						secondaryText: e(
							'div',
							null,
							t(this.props.settings.language, 'contributors_last_edit'),
							e(
								Time,
								{
									date: new Date(contributor.timestamp * 1000),
								}
							)
						),
						leftAvatar: e(
							Avatar,
							{
								src: gravatar.url(contributor.email, {protocol: 'https', s: '80', r: 'pg', d: 'mm'}),
							}
						),
					}
				)
			})
		)
	}

	render() {

		return (
			e(
				Card,
				{
					className: 'contributors',
				},
				e(
					CardTitle,
					{
						title: t(this.props.settings.language, 'contributors_title'),
					}
				),
				this.state.loading ? e(
					CardText,
					null,
					e(CircularProgress)
				) : this.renderList()
			)
		)
	}
}


function mapStateToProps(state) {
	return {
		loading: state.loading,
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(Contributors)
