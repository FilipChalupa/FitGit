const React = require('react')
const e = React.createElement
const Component = React.Component
const Link = require('react-router').Link
const connect = require('react-redux').connect
const bindActionCreators = require('redux').bindActionCreators
const remote = require('electron').remote
const AppBar = require('material-ui/AppBar')
const Drawer = require('material-ui/Drawer')
const MenuItem = require('material-ui/MenuItem')
const IconButton = require('material-ui/IconButton')
const NavigationClose = require('material-ui/svg-icons/navigation/close')
const SettingsIcon = require('material-ui/svg-icons/action/settings')
const CommitIcon = require('material-ui/svg-icons/action/play-for-work')
const ProjectsIcon = require('material-ui/svg-icons/device/storage')
const ProjectIcon = require('material-ui/svg-icons/action/lightbulb-outline')
const HistoryIcon = require('material-ui/svg-icons/action/settings-backup-restore')
const IntegrateChangesIcon = require('material-ui/svg-icons/action/get-app')
const IntegrateChangesAlertIcon = require('material-ui/svg-icons/av/new-releases')
const ProjectsActions = require( '../actions/projects')
const IntegratorActions = require( '../actions/integrator')

class Menu extends Component {

	constructor(props) {
		super(props)
		this.state = { open: false }
	}

	getItem(path, title, leftIcon, rightIcon = null) {
		return (
			e(
				MenuItem,
				{
					key: path,
					onTouchTap: this.handleClose,
					containerElement: e(Link, { to: path }),
					primaryText: title,
					leftIcon: leftIcon,
					rightIcon: rightIcon,
				}
			)
		)
	}

	getItems() {
		const items = []
		if (this.props.projects.active) {
			items.push(this.getItem(
				'/project',
				this.props.projects.active.name,
				e(ProjectIcon)
			))
			if (this.props.integrator.available) {
				items.push(this.getItem(
					'/integrateChanges',
					this.props.settings.texts.menu_integrateChanges,
					e(IntegrateChangesIcon),
					e(IntegrateChangesAlertIcon)
				))
			}
			items.push(this.getItem(
				'/commit',
				this.props.settings.texts.menu_commit,
				e(CommitIcon)
			))
		}
		items.push(this.getItem(
			'/projects',
			this.props.settings.texts.menu_projects,
			e(ProjectsIcon)
		))
		if (this.props.projects.active) {
			items.push(this.getItem(
				'/history',
				this.props.settings.texts.menu_history,
				e(HistoryIcon)
			))
		}
		items.push(this.getItem(
			'/settings',
			this.props.settings.texts.menu_settings,
			e(SettingsIcon)
		))
		return items
	}

	handleToggle() { this.setState({ open: !this.state.open }) }

	handleClose() { this.setState({ open: false }) }

	render() {
		const title = this.props.projects.active ? this.props.projects.active.name : remote.app.getName()

		return (
			e(
				'div',
				null,
				e(
					AppBar,
					{
						style: { position: 'sticky', top: 0 },
						onLeftIconButtonTouchTap: this.handleToggle,
						title: title,
						iconClassNameRight: 'muidocs-icon-navigation-expand-more',
						iconElementLeft: (this.props.integrator.available || null) && e(IconButton, null, e(IntegrateChangesAlertIcon)),
					}
				),

				e(
					Drawer,
					{
						open: this.state.open,
						docked: false,
						onRequestChange: (open) => this.setState({ open }),
					},
					e(
						AppBar,
						{
							title: 'Menu',
							iconElementLeft: (
								e(
									IconButton,
									{
										onTouchTap: () => this.setState({ open: false }),
									},
									e(NavigationClose)
								)
							),
						}
					),
					this.getItems()
				)
			)
		)
	}
}


function mapStateToProps(state) {
	return {
		integrator: state.integrator,
		projects: state.projects,
		settings: state.settings,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			integrator: bindActionCreators(IntegratorActions, dispatch),
			projects: bindActionCreators(ProjectsActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Menu)
