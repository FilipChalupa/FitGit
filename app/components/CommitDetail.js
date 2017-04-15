const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const LoadingActions = require('../actions/loading')

class CommitDetail extends Component {

	render() {
		return (
			e(
				'div',
				null,
				e('h1', null, 'Detail commitu'),
				this.props.sha
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
