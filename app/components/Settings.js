const React = require('react')
const e = React.createElement
const Component = React.Component
const Link = require('react-router').Link
const connect = require('react-redux').connect
const bindActionCreators = require('redux').bindActionCreators
const SelectField = require('material-ui/SelectField').default
const MenuItem = require('material-ui/MenuItem').default
const RaisedButton = require('material-ui/RaisedButton').default
const FlatButton = require('material-ui/FlatButton').default
const Dialog = require('material-ui/Dialog').default
const Toggle = require('material-ui/Toggle').default
const TextField = require('material-ui/TextField').default
const SettingsActions = require('../actions/settings')
const LoadingActions = require('../actions/loading')
const fsp = require('fs-promise')
const path = require('path')
const t = require('../utils/text')
const log = require('../utils/log')

const LANGUAGES_DIR = path.resolve(__dirname, '..', 'languages')

class Settings extends Component {

	constructor(props) {
		super(props)

		this.state = {
			confirmReset: false,
			languages: [],
		}
	}


	componentDidMount() {
		this.loadLanguages()
	}


	loadLanguages() {
		fsp.readdir(LANGUAGES_DIR)
			.then((files) => {
				this.setState(Object.assign({}, this.state, {
					languages: files.map((file) => {
						return file.split('.json')[0]
					})
				}))
			})
			.catch((error) => {
				log.error(error)
			})
	}


	getItems() {
		return this.state.languages.map((code) => {
			return (
				e(
					MenuItem,
					{
						key: code,
						value: code,
						primaryText: t(this.props.settings.language, `language_${code}`),
					}
				)
			)
		})
	}

	handleLanguageChange(e, i, code) {
		this.props.actions.settings.setLanguage(code, code)
	}

	handleMergeMessageChange(event) {
		this.props.actions.settings.setMergeMessage(event.target.value)
	}

	openConfirmReset() {
		this.setState(Object.assign({}, this.state, { confirmReset: true }))
	}

	closeConfirmReset() {
		this.setState(Object.assign({}, this.state, { confirmReset: false }))
	}

	render() {
		return (
			e(
				'div',
				{
					style: {
						maxWidth: 250,
					}
				},
				e('h1', null, t(this.props.settings.language, 'menu_settings')),
				e(
					'div',
					null,
					e(
						RaisedButton,
						{
							label: t(this.props.settings.language, 'settings_reset'),
							secondary: true,
							onTouchTap: this.openConfirmReset.bind(this),
						}
					)
				),
				e(
					SelectField,
					{
						floatingLabelText: t(this.props.settings.language, 'settings_language'),
						value: this.props.settings.language,
						onChange: this.handleLanguageChange.bind(this),
					},
					this.getItems()
				),
				e(
					Toggle,
					{
						label: 'Automaticky sdílet změny',
						toggled: this.props.settings.autoPush,
						onToggle: () => this.props.actions.settings.toggleAutoPush(),
					}
				),
				/*e(
					TextField,
					{
						floatingLabelText: 'Název merge commitu',
						value: this.props.settings.mergeMessage,
						onChange: this.handleMergeMessageChange.bind(this),
					}
				),*/

				e(
					Dialog,
					{
						title: "Obnovit nastavení",
						actions: [
							e(
								FlatButton,
								{
									label: "Zrušit",
									primary: true,
									onTouchTap: this.closeConfirmReset.bind(this),
								}
							),
							e(
								FlatButton,
								{
									label: "Potvrdit",
									primary: true,
									keyboardFocused: true,
									onTouchTap: () => {
										this.props.actions.settings.resetSettings()
										this.closeConfirmReset()
									},
								}
							)
						],
						modal: false,
						open: this.state.confirmReset,
						onRequestClose: this.closeConfirmReset.bind(this),
					},
					'Opravdu chcete obnovit nastavení?'
				)
			)
		)
	}
}


module.exports = connect((state) => {
	return {
		settings: state.settings,
	}
}, (dispatch) => {
	return {
		actions: {
			loading: bindActionCreators(LoadingActions, dispatch),
			settings: bindActionCreators(SettingsActions, dispatch),
		}
	}
})(Settings)
