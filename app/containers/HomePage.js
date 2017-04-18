const React = require('react')
const e = React.createElement
const Component = React.Component
const Home = require('../components/Home')
const hashHistory = require('react-router').hashHistory

module.exports = class HomePage extends Component {

	componentDidMount() {
		hashHistory.push('/projects')
	}


	render() {
		return (
			e(Home)
		)
	}
}
