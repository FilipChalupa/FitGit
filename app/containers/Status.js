const React = require('react')
const e = React.createElement
const Component = React.Component
const connect = require('react-redux').connect
const bindActionCreators = require('redux').bindActionCreators
const Snackbar = require('material-ui/Snackbar').default
const StatusActions = require('../actions/status')

class Status extends Component {

	constructor(props) {
		super(props)

		this.counter = 0
	}

	componentWillUnMount() {
		clearTimeout(this.timer)
	}

	handleRequestClose() {
		this.props.actions.status.closeStatus()
	}

	render() {
		return (
			e(
				Snackbar,
				{
					open: this.props.status.open,
					message: this.props.status.message,
					action: this.props.status.buttonText,
					onActionTouchTap: this.props.status.buttonCallback,
					onRequestClose: () => this.handleRequestClose,
				}
			)
		)
	}
}


function mapStateToProps(state) {
	return {
		status: state.status,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			status: bindActionCreators(StatusActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Status)
