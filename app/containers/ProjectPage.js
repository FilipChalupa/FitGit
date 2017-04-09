const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const Project = require('../components/Project')
const ProjectsActions = require('../actions/projects')

function mapStateToProps(state) {
	return {
		projects: state.projects
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ProjectsActions, dispatch)
}

module.exports =  connect(mapStateToProps, mapDispatchToProps)(Project)
