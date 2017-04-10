const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const Dialog = require('material-ui/Dialog').default
const BottomNavigation = require('material-ui/BottomNavigation').BottomNavigation
const BottomNavigationItem = require('material-ui/BottomNavigation').BottomNavigationItem
const Paper = require('material-ui/Paper').default
const RadioButton = require('material-ui/RadioButton').RadioButton
const RadioButtonGroup = require('material-ui/RadioButton').RadioButtonGroup
const IconAdd = require('material-ui/svg-icons/content/add-box').default
const FlatButton = require('material-ui/FlatButton').default
const TextField = require('material-ui/TextField').default
const Tabs = require('material-ui/Tabs').Tabs
const Tab = require('material-ui/Tabs').Tab
const ProjectsActions = require('../actions/projects')
const StatusActions = require('../actions/status')
const dialog = require('electron').remote.dialog
const path = require('path')

const TAB_NEW   = 'TAB_NEW'
const TAB_URL   = 'TAB_URL'
const TAB_LOCAL = 'TAB_LOCAL'

class ProjectAdd extends Component {

	constructor(props) {
		super(props)

		this.state = {
			openAddModal: false,
			directoryPath: '',
			url: '',
			active: TAB_NEW,
		}
	}

	getDirectory() {
		const dialogDirectories = dialog.showOpenDialog({properties: ['openDirectory']})
		if (!dialogDirectories) {
			return
		}
		const repoDirectory = dialogDirectories[0] // @TODO: Validate repository exists

		this.handlePathChange(null, repoDirectory)
	}

	setActiveTab(active) {
		const newState = Object.assign({}, this.state, { active })
		this.setState(newState)
	}

	handlePathChange(e, value) {
		const newState = Object.assign({}, this.state, { directoryPath: value })
		this.setState(newState)
	}

	handleURLChange(e, value) {
		const newState = Object.assign({}, this.state, { url: value })
		this.setState(newState)
	}

	appendProject(project) {
		const newProjects = this.props.projects.list.concat([project])
		this.props.actions.projects.setProjects(newProjects)
	}

	getURLField() {
		return (
			e(
				TextField,
				{
					name: 'url',
					type: 'url',
					hintText: 'Adresa repozitáře',
					value: this.state.url,
					onChange: this.handleURLChange.bind(this),
				}
			)
		)
	}

	getDirectoryField() {
		return (
			e(
				'div',
				null,
				e(
					TextField,
					{
						name: 'path',
						hintText: 'Umístění v tomto zařízení',
						value: this.state.directoryPath,
						onChange: this.handlePathChange.bind(this),
					}
				),
				e(
					FlatButton,
					{
						label: 'Zvolit adresář',
						style: {
							verticalAlign: 'middle',
						},
						onTouchTap: this.getDirectory.bind(this),
					}
				)
			)
		)
	}

	openAddModal(open) {
		const newState = Object.assign({}, this.state, { openAddModal: open })
		this.setState(newState)
	}

	addProject() {
		const url = this.state.url // @TODO: init empty project if possible
		const localPath = this.state.directoryPath
		const project = {
			name: path.basename(localPath),
			note: localPath,
			path: localPath,
		}
		this.appendProject(project)
		this.openAddModal(false)

		this.props.actions.status.addStatus(
			`Byl přidán projekt: ${project.name}`,
			'Vrátit zpět',
			() => {
				this.props.actions.projects.removeProject(project)
			}
		)
	}

	render() {
		const actions = [
			e(
				FlatButton,
				{
					label: "Přidat",
					primary: true,
					onTouchTap: this.addProject.bind(this),
				}
			),
			e(
				FlatButton,
				{
					label: "Zrušit",
					onTouchTap: () => this.openAddModal(false),
				}
			),
		]

		return (
			e(
				'div',
				null,
				e(
					Dialog,
					{
						actions: actions,
						onRequestClose: () => this.openAddModal(false),
						open: this.state.openAddModal,
					},
					e(
						Tabs,
						null,
						e(
							Tab,
							{
								label: "Nový projekt",
								onActive: () => this.setActiveTab(TAB_NEW),
							},
							e(
								'div',
								null,
								e('p', null, 'Zvolte adresář, ze kterého se vytvoří nový projekt. Adresář může obsahovat již rozpracované dílo.'),
								this.getDirectoryField()
							)
						),
						e(
							Tab,
							{
								label: "Z URL",
								onActive: () => this.setActiveTab(TAB_URL),
							},
							e(
								'div',
								null,
								e('p', null, 'Zvolte adresu, ze které se stáhne existující projekt do místního adresáře.'),
								this.getURLField(),
								this.getDirectoryField()
							)
						),
						e(
							Tab,
							{
								label: "Z adresáře",
								onActive: () => this.setActiveTab(TAB_LOCAL),
							},
							e(
								'div',
								null,
								e('p', null, 'Zvolte adresář, který obsahuje již existující projekt.'),
								this.getDirectoryField()
							)
						)
					)
				),

				e(
					Paper,
					{
						style: {
							position: 'fixed',
							bottom: 0,
							left: 0,
							right: 0,
							zIndex: 1,
						},
					},
					e(
						BottomNavigation,
						null,
						e(
							BottomNavigationItem,
							{
								label: "Přidat",
								icon: e(IconAdd),
								onTouchTap: () => this.openAddModal(true),
							}
						)
					)
				)
			)
		)
	}
}


function mapStateToProps(state) {
	return {
		projects: state.projects,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			projects: bindActionCreators(ProjectsActions, dispatch),
			status: bindActionCreators(StatusActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ProjectAdd)
