const React = require('react')
const e = React.createElement
const Component = React.Component
const History = require('../components/History')

module.exports = class HistoryPage extends Component {
	render() {
		return (
			e(History)
		)
	}
}
