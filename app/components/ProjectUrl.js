const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const nodegit = require('../utils/nodegit').nodegit
const LoadingActions = require('../actions/loading')
const CircularProgress = require('material-ui/CircularProgress').default
const log = require('../utils/log')
const c = require('material-ui/Card')
const Card = c.Card
const CardTitle = c.CardTitle
const CardText = c.CardText
const t = require('../utils/text')
const TextField = require('material-ui/TextField').default

class ProjectUrl extends Component {

	constructor(props) {
		super(props)

		this.state = {
			url: '',
			failed: false,
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
		this.setLoading(true)
		let repo

		nodegit.Repository.open(this.props.project.path)
			.then((r) => repo = r)
			.then(() => repo.getCurrentBranch())
			.then((localBranch) => nodegit.Branch.upstream(localBranch))
			.then((remoteRef) => remoteRef.toString().split('/')[2])
			.then((remoteName) => repo.getRemote(remoteName))
			.then((remote) => remote.url())
			.then((url) => {
				this.setState(Object.assign({}, this.state, { url }))
			})
			.catch((error) => {
				log.error(error)
				this.setState(Object.assign({}, this.state, { failed: true }))
			})
			.then(() => {
				this.setLoading(false)
			})
	}

	renderUrl() {
		return e(
			TextField,
			{
				name: 'url',
				value: this.state.url,
				fullWidth: true,
			}
		)
	}

	render() {
		if (this.state.failed) {
			return null
		}

		return (
			e(
				Card,
				{
					className: 'projectUrl',
				},
				e(
					CardTitle,
					{
						title: t(this.props.settings.language, 'project_url_title'),
						subtitle: t(this.props.settings.language, 'project_url_subtitle'),
					}
				),
				e(
					CardText,
					null,
					this.state.loading ? e(CircularProgress) : this.renderUrl()
				)
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(ProjectUrl)
