const React = require('react')
const e = React.createElement
const Component = React.Component
const Branches = require('./Branches')

module.exports = class Project extends Component {

	render() {
		return (
			e(
				'div',
				null,
				e('h1', null, 'Detail projektu'),
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
