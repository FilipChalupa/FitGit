const React = require('react')
const e = React.createElement
const Component = React.Component
const Link = require('react-router').Link
const connect = require('react-redux').connect
const bindActionCreators = require('redux').bindActionCreators
const remote = require('electron').remote
const AppBar = require('material-ui/AppBar').default
const Drawer = require('material-ui/Drawer').default
const MenuItem = require('material-ui/MenuItem').default
const IconButton = require('material-ui/IconButton').default
const NavigationClose = require('material-ui/svg-icons/navigation/close').default
const SettingsIcon = require('material-ui/svg-icons/action/settings').default
const CommitIcon = require('material-ui/svg-icons/action/play-for-work').default
const ProjectsIcon = require('material-ui/svg-icons/device/storage').default
const ProjectIcon = require('material-ui/svg-icons/action/lightbulb-outline').default
const HistoryIcon = require('material-ui/svg-icons/action/settings-backup-restore').default
const IntegrateChangesIcon = require('material-ui/svg-icons/action/get-app').default
const AlertIcon = require('material-ui/svg-icons/av/new-releases').default
const FlatButton = require('material-ui/FlatButton').default
const ProjectsActions = require( '../actions/projects')
const IntegratorActions = require( '../actions/integrator')
const hashHistory = require('react-router').hashHistory
const t = require('../utils/text')
const ActionCloseIcon = require('material-ui/svg-icons/image/navigate-before').default

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
					onTouchTap: this.handleClose.bind(this),
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
					t(this.props.settings.language, 'menu_integrateChanges'),
					e(IntegrateChangesIcon),
					this.props.integrator.notification ? e(AlertIcon) : null
				))
			}
			if (this.props.integrator.commitAvailable) {
				items.push(this.getItem(
					'/commit',
					t(this.props.settings.language, 'menu_commit'),
					e(CommitIcon),
					this.props.integrator.commitNotification ? e(AlertIcon) : null
				))
			}
		}
		items.push(this.getItem(
			'/projects',
			t(this.props.settings.language, 'menu_projects'),
			e(ProjectsIcon)
		))
		if (this.props.projects.active) {
			items.push(this.getItem(
				'/history',
				t(this.props.settings.language, 'menu_history'),
				e(HistoryIcon)
			))
		}
		items.push(this.getItem(
			'/settings',
			t(this.props.settings.language, 'menu_settings'),
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
						onLeftIconButtonTouchTap: this.handleToggle.bind(this),
						onRightIconButtonTouchTap: this.props.menu.action && (() => hashHistory.push(this.props.menu.action.route)),
						title: title,
						iconElementLeft: (this.props.integrator.notification || this.props.integrator.commitNotification || null) && e(IconButton, null, e(AlertIcon)),
						iconElementRight: this.props.menu.action && e(FlatButton, {
							label: this.props.menu.action.title,
							icon: e(ActionCloseIcon),
						}),
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
							title: t(this.props.settings.language, 'menu_title'),
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
		menu: state.menu,
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
