const React = require('react')
const e = React.createElement
const Component = React.Component
const Card = require('material-ui/Card').Card
const CardActions = require('material-ui/Card').CardActions
const CardHeader = require('material-ui/Card').CardHeader
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
				marginBottom: '20px',
			}
			if (compareProjects(project, this.props.activeProject)) {
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
						CardHeader,
						{
							title: project.name,
							subtitle: project.note,
							actAsExpander: false,
							style: {
								cursor: 'pointer',
							},
							//showExpandableButton: true,
							onTouchTap: () => this.props.setActiveProject(project),
						}
					),
					e(
						CardActions,
						null,
						e(
							RaisedButton,
							{
								label: 'Zvolit',
								primary: true,
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
					/*<CardText expandable={true}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
						Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
						Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
					</CardText>*/
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
