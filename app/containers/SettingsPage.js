const React = require('react')
const e = React.createElement
const Component = React.Component
const Settings = require('../components/Settings')

module.exports = class SettingsPage extends Component {
	render() {
		return (
			e(Settings)
		)
	}
}
