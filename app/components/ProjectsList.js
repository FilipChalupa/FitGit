const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const Card = require('material-ui/Card').Card
const CardActions = require('material-ui/Card').CardActions
const CardTitle = require('material-ui/Card').CardTitle
const CardText = require('material-ui/Card').CardText
const FlatButton = require('material-ui/FlatButton').default
const RaisedButton = require('material-ui/RaisedButton').default
const compareProjects = require('../utils/compareProjects')
const hashHistory = require('react-router').hashHistory
const t = require('../utils/text')

class ProjectsList extends Component {


	selectProject(project) {
		if (compareProjects(project, this.props.activeProject)) {
			hashHistory.push('/project')
		} else {
			this.props.setActiveProject(project)
		}
	}


	renderProjects() {
		if (this.props.projects.length === 0) {
			return (
				e('div', null, t(this.props.settings.language, 'projects_list_nothing'))
			)
		}
		return this.props.projects.map((project, i) => {
			const style = {
				marginBottom: 20,
			}
			const isActive = compareProjects(project, this.props.activeProject)
			if (isActive) {
				style.backgroundColor = 'rgb(240, 240, 240)'
			}
			return (
				e(
					Card,
					{
						key: i,
						style: style,
					},
					e(
						CardTitle,
						{
							title: project.name,
							subtitle: project.note,
							style: {
								cursor: 'pointer',
							},
							onTouchTap: () => this.selectProject(project),
						}
					),
					e(
						CardActions,
						null,
						e(
							RaisedButton,
							{
								label: isActive ? t(this.props.settings.language, 'projects_action_detail') : t(this.props.settings.language, 'projects_action_select'),
								primary: !isActive,
								secondary: isActive,
								onTouchTap: () => this.selectProject(project),
							}
						),
						e(
							FlatButton,
							{
								label: t(this.props.settings.language, 'projects_action_remove'),
								onTouchTap: () => this.props.removeProject(project),
							}
						)
					)
				)
			)
		})
	}

	render() {
		const projects = this.renderProjects()

		return (
			e(
				'div',
				null,
				projects
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
})(ProjectsList)
