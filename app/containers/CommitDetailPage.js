const React = require('react')
const e = React.createElement
const Component = React.Component
const CommitDetail = require('../components/CommitDetail')

module.exports = class CommitDetailPage extends Component {
	render() {
		return (
			e(
				CommitDetail,
				{
					sha: this.props.routeParams.sha,
				}
			)
		)
	}
}
