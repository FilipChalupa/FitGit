const React = require('react')
const e = React.createElement
const Component = React.Component
const Link = require('react-router').Link
const connect = require('react-redux').connect
const bindActionCreators = require('redux').bindActionCreators
const LinearProgress = require('material-ui/LinearProgress').default
const LoadingActions = require('../actions/loading')

class Loading extends Component {

	render() {
		return (
			e(
				LinearProgress,
				{
					mode: 'indeterminate',
					style: {
						position: 'fixed',
						left: 0,
						right: 0,
						bottom: 0,
						zIndex: 1,
						pointerEvents: 'none',
						transition: 'opacity 0.3s',
						opacity: this.props.loading ? 1 : 0,
					},
				}
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
	return bindActionCreators(LoadingActions, dispatch)
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Loading)
