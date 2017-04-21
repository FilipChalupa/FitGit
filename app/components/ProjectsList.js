const React = require('react')
const e = React.createElement
const Component = React.Component
const Card = require('material-ui/Card').Card
const CardActions = require('material-ui/Card').CardActions
const CardTitle = require('material-ui/Card').CardTitle
const CardText = require('material-ui/Card').CardText
const FlatButton = require('material-ui/FlatButton').default
const RaisedButton = require('material-ui/RaisedButton').default
const compareProjects = require('../utils/compareProjects')
const hashHistory = require('react-router').hashHistory

module.exports = class ProjectsList extends Component {


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
				e('div', null, 'Zatím nemáte žádný projekt. Nový přidáte tlačítkem plus v dolní části okna.')
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
								label: isActive ? 'Detail' : 'Zvolit',
								primary: !isActive,
								secondary: isActive,
								onTouchTap: () => this.selectProject(project),
							}
						),
						e(
							FlatButton,
							{
								label: 'Odebrat',
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
