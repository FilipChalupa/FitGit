const React = require('react')
const e = React.createElement
const Component = React.Component
const ProjectsList = require('./ProjectsList')
const ProjectAdd = require('./ProjectAdd')

module.exports = class Projects extends Component {

	render() {

		return (
			e(
				'div',
				null,
				e('h1', null, 'Projekty'),
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
