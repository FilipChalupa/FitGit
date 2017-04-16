const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const RaisedButton = require('material-ui/RaisedButton').default
const FlatButton = require('material-ui/FlatButton').default
const RefreshIcon = require('material-ui/svg-icons/navigation/refresh').default
const nodegit = require('../utils/nodegit').nodegit
const IntegratorActions = require('../actions/integrator')
const LoadingActions = require('../actions/loading')
const Diff = require('./Diff')
const hashHistory = require('react-router').hashHistory

class IntegrateChanges extends Component {

	constructor(props) {
		super(props)

		this.state = {
			updating: false,
			shaA: null,
			shaB: null,
		}

		this.repo = null
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
		this.props.actions.integrator.dismissNotification()
	}

	refresh() {
		this.setUpdating(true)
		let shaA
		let shaB
		nodegit.Repository.open(this.props.projects.active.path)
			.then((r) => {
				this.repo = r
				return this.repo.getBranchCommit('master') // @TODO: get main branch
			})
			.then((commit) => shaB = commit.sha())
			.then(() => this.repo.getBranchCommit('origin/master'))
			.then((commit) => {
				shaA = commit.sha()
				this.setState(Object.assign({}, this.state, {
					shaA,
					shaB,
				}))
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				this.setUpdating(false)
			})
	}

	accept() {
		if (!this.repo) {
			return
		}
		let success = false
		this.setUpdating(true)
		const author = this.repo.defaultSignature()
		this.repo.mergeBranches('master', 'origin/master', author) // @TODO: get active branches
			.then((oid) => {
				success = true
			})
			.catch((error) => {
				alert('Asi došlo ke konfliktu')
				console.error(error)
			})
			.then(() => {
				this.setUpdating(false)
				if (success) {
					hashHistory.push('/history')
				} else {
					this.refresh()
				}
			})
	}

	render() {
		return (
			e(
				'div',
				null,
				e(
					'div',
					null,
					e('h1', null, 'Začlenit změny'),
					e(
						RaisedButton,
						{
							label: 'Přijmout změny',
							secondary: true,
							onTouchTap: this.accept.bind(this),
							disabled: this.state.updating,
						}
					),
					e(
						FlatButton,
						{
							icon: e(RefreshIcon),
							onTouchTap: this.refresh.bind(this),
							disabled: this.state.updating,
						}
					)
				),
				e(
					'div',
					{
						style: {
							marginTop: 20,
						},
					},
					e(
						Diff,
						{
							shaA: this.state.shaA,
							shaB: this.state.shaB,
						}
					)
				)
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
			integrator: bindActionCreators(IntegratorActions, dispatch),
			loading: bindActionCreators(LoadingActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(IntegrateChanges)
