const React = require('react')
const e = React.createElement
const Component = React.Component
const Branches = require('./Branches')
const Contributors = require('./Contributors')
const AuthSetter = require('./AuthSetter')
const TypicalCommit = require('./TypicalCommit')
const hashHistory = require('react-router').hashHistory

module.exports = class Project extends Component {

	render() {
		if (!this.props.projects.active) {
			return null
		}

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
					TypicalCommit,
					{
						project: this.props.projects.active,
					}
				),
				e(
					AuthSetter,
					{
						project: this.props.projects.active,
					}
				)/*,
				e(
					Branches,
					{
						project: this.props.projects.active,
					}
				)*/
			)
		)
	}
}
