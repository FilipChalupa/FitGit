const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const Projects = require('../components/Projects')
const ProjectsActions = require('../actions/projects')

function mapStateToProps(state) {
	return {
		projects: state.projects
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ProjectsActions, dispatch)
}

module.exports =  connect(mapStateToProps, mapDispatchToProps)(Projects)
