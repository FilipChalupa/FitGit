const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const ProjectsList = require('./ProjectsList')
const ProjectAdd = require('./ProjectAdd')
const t = require('../utils/text')

class Projects extends Component {

	render() {

		return (
			e(
				'div',
				null,
				e('h1', null, t(this.props.settings.language, 'projects_title')),
				e(
					ProjectsList,
					{
						projects: this.props.projects.list,
						activeProject: this.props.projects.active,
						setActiveProject: this.props.setActiveProject,
						removeProject: this.props.removeProject,
						setProjects: this.props.setProjects,
					}
				),
				e(ProjectAdd)
			)
		)
	}
}


module.exports = connect((state) => {
	return {
		settings: state.settings,
	}
}, (dispatch) => {
	return {}
})(Projects)
