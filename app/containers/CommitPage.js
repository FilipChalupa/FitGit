const React = require('react')
const e = React.createElement
const Component = React.Component
const Commit = require('../components/Commit')

module.exports = class CommitPage extends Component {
	render() {
		return (
			e(Commit)
		)
	}
}
