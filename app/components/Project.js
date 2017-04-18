const React = require('react')
const e = React.createElement
const Component = React.Component
const Branches = require('./Branches')
const Contributors = require('./Contributors')

module.exports = class Project extends Component {

	render() {
		return (
			e(
				'div',
				null,
				e('h1', null, 'Detail projektu'),
				e(
					Contributors,
					{
						project: this.props.projects.active,
					}
				),
				e(
					Branches,
					{
						project: this.props.projects.active,
					}
				)
			)
		)
	}
}
