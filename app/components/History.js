const React = require('react')
const e = React.createElement
const Component = React.Component

module.exports = class History extends Component {
	render() {
		return (
			e(
				'div',
				null,
				e('h1', null, 'Historie')
			)
		)
	}
}
