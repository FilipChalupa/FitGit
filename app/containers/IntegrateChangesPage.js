const React = require('react')
const e = React.createElement
const Component = React.Component
const IntegrateChanges = require('../components/IntegrateChanges')

module.exports = class IntegrateChangesPage extends Component {
	render() {
		return (
			e(IntegrateChanges)
		)
	}
}
