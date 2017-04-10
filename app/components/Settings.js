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
const SettingsActions = require('../actions/settings')

class Settings extends Component {

	constructor(props) {
		super(props)

		this.state = {
			confirmReset: false,
		}
	}

	getItems() {
		const items = {
			cs: 'Česky',
			en: 'English',
			de: 'Deutsch',
		}
		return Object.keys(items).map((key) => {
			return (
				e(
					MenuItem,
					{
						key: key,
						value: key,
						primaryText: items[key],
					}
				)
			)
		})
	}

	handleChange(e, i, language) {
		this.props.setLanguage(language)
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
				null,
				e('h1', null, this.props.settings.texts.menu_settings),
				e(
					SelectField,
					{
						floatingLabelText: this.props.settings.texts.settings_language,
						value: this.props.settings.language,
						onChange: this.handleChange.bind(this),
					},
					this.getItems()
				),

				e(
					'div',
					null,
					e(
						RaisedButton,
						{
							label: "Obnovit nastavení",
							secondary: true,
							onTouchTap: this.openConfirmReset.bind(this),
						}
					)
				),

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
										this.props.resetSettings()
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


function mapStateToProps(state) {
	return {
		settings: state.settings,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(SettingsActions, dispatch)
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Settings)
