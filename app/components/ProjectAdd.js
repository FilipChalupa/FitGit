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
const LoadingActions = require('../actions/loading')
const dialog = require('electron').remote.dialog
const path = require('path')
const fsp = require('fs-promise')
const nodegit = require('../utils/nodegit').nodegit
const remoteCallbacks = require('../utils/remoteCallbacks')

const TAB_URL   = 'TAB_URL'
const TAB_LOCAL = 'TAB_LOCAL'

class ProjectAdd extends Component {

	constructor(props) {
		super(props)

		this.state = {
			openAddModal: false,
			directoryPath: '',
			url: '',
			active: TAB_LOCAL,
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
		const url = this.state.url
		const localPath = this.state.directoryPath
		const project = {
			name: path.basename(localPath),
			note: localPath,
			path: localPath,
		}
		this.openAddModal(false)

		this.props.actions.loading.IncrementLoadingJobs()
		Promise.resolve()
			.then(() => {
				if (this.state.active === TAB_LOCAL) {
					return this.prepareLocalProject(localPath)
				} else if (this.state.active === TAB_URL) {
					return this.prepareUrlProject(localPath, url)
				}
			})
			.then(() => {
				this.appendProject(project)
				this.props.actions.status.addStatus(
					`Byl přidán projekt: ${project.name}`,
					'Vrátit zpět',
					() => {
						this.props.actions.projects.removeProject(project)
					}
				)
			})
			.catch((error) => {
				console.error()
			})
			.then(() => {
				this.props.actions.loading.DecrementLoadingJobs()
			})
	}


	prepareLocalProject(path) {
		return Promise.resolve()
			.then(() => fsp.stat(path))
			.then(() => nodegit.Repository.open(path))
			.catch((error) => {
				console.warn(error)
				this.props.actions.status.addStatus(
					'Umístění projektu nenalezeno'
				)
				throw new Error('Invalid location.')
			})
	}


	prepareUrlProject(path, url) {
		return Promise.resolve() // @TODO: smarter tests
			.then(() => nodegit.Clone.clone(url, path, { fetchOpts: remoteCallbacks }))
			.catch((error) => {
				console.warn(error)
				this.props.actions.status.addStatus(
					'Z URL se nepodařila stáhnout data'
				)
				throw new Error('Invalid URL.')
			})
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
								label: "Z adresáře",
								onActive: () => this.setActiveTab(TAB_LOCAL),
							},
							e(
								'div',
								null,
								e('p', null, 'Zvolte adresář, který obsahuje již existující projekt.'),
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
			loading: bindActionCreators(LoadingActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ProjectAdd)
