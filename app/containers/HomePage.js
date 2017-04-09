const React = require('react')
const e = React.createElement
const Component = React.Component
const Home = require('../components/Home')

module.exports = class HomePage extends Component {
	render() {
		return (
			e(Home)
		)
	}
}
