const React = require('react')
const e = React.createElement
const Component = React.Component

module.exports = class Home extends Component {
	render() {
		return (
			e(
				'div',
				null,
				'Úvodní obrazovka - pro více možností rozbalte levé menu.'
			)
		)
	}
}
