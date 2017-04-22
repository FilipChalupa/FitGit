const React = require('react')
const e = React.createElement
const Component = React.Component
const Menu = require('./Menu')
const Loading = require('./Loading')
const Watcher = require('./Watcher')
const Status = require('./Status')
const InputContext = require('../components/InputContext')

module.exports = class App extends Component {

	render() {
		return (
			e(
				'div',
				{
					className: 'layout',
				},
				e(Menu),
				e(
					'div',
					{
						className:'layout-content',
					},
					this.props.children
				),
				e(Loading),
				e(Status),
				e(Watcher),
				e(InputContext)
			)
		)
	}

}
