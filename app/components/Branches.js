const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const List = require('material-ui/List').List
const ListItem = require('material-ui/List').ListItem
const Subheader = require('material-ui/Subheader')
const LabelIcon = require('material-ui/svg-icons/action/label')
const LabelOutlineIcon = require('material-ui/svg-icons/action/label-outline')
const colors = require('material-ui/styles/colors')
const nodegit = require('../utils/nodegit')
const getLocalBranches = nodegit.getLocalBranches
const getRemoteBranches = nodegit.getRemoteBranches
const getCurrentBranch = nodegit.getCurrentBranch
const LoadingActions = require('../actions/loading')

const branchColors = [
	colors.red500,
	colors.lightGreen500,
	colors.blue500,
	colors.yellow500,
	colors.pink500,
	colors.orange500,
	colors.purple500,
	colors.green500,
	colors.brown500,
	colors.deepOrange500,
	colors.deepPurple500,
	colors.lime500,
	colors.indigo500,
	colors.amber500,
]

class Branches extends Component {

	constructor(props) {
		super(props)

		this.state = {
			currentBranch: null,
			localBranches: {},
			remoteBranches: {},
		}
	}

	componentDidMount() {
		this.refresh()
	}

	refresh() {
		this.props.actions.loading.IncrementLoadingJobs()
		getLocalBranches(this.props.project.path)
			.then((branches) => {
				this.setState(Object.assign({}, this.state, {
					localBranches: this.makeTrees(branches),
				}))
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				this.props.actions.loading.DecrementLoadingJobs()
			})

		this.props.actions.loading.IncrementLoadingJobs()
		getRemoteBranches(this.props.project.path)
			.then((branches) => {
				this.setState(Object.assign({}, this.state, {
					remoteBranches: this.makeTrees(branches),
				}))
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				this.props.actions.loading.DecrementLoadingJobs()
			})

		this.props.actions.loading.IncrementLoadingJobs()
		getCurrentBranch(this.props.project.path)
			.then((branch) => {
				this.setState(Object.assign({}, this.state, {
					currentBranch: branch,
				}))
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				this.props.actions.loading.DecrementLoadingJobs()
			})
	}

	makeTrees(branches) {
		const trees = {}
		branches.forEach((branch) => {
			const parts = branch.split('/')
			let i = 0
			let t = trees
			while (i < parts.length) {
				if (t[parts[i]] === undefined) {
					t[parts[i]] = {}
				}
				t = t[parts[i]]
				i++
			}
		})
		return trees
	}

	renderBranches(branches, isLocal = true, prefix = '', color = null) {
		return branches && Object.keys(branches).map((branch, i) => {
			const groupColor = color || branchColors[i % branchColors.length]
			const nestedItems = this.renderBranches(branches[branch], isLocal, `${prefix}${branch}/`, groupColor)
			const Icon = nestedItems.length ? LabelOutlineIcon : LabelIcon
			const text = prefix + branch
			const style = {}
			if (isLocal && this.state.currentBranch && this.state.currentBranch.startsWith(text)) {
				style.fontWeight = 'bold'
			}
			return (
				e(
					ListItem,
					{
						key: i,
						primaryText: text,
						leftIcon: e(
							Icon,
							{
								color: groupColor,
							}
						),
						style: style,
						initiallyOpen: isLocal,
						primaryTogglesNestedList: nestedItems.length !== 0,
						onTouchTap: () => {
							this.checkout(`refs/${isLocal ? 'heads' : 'remotes'}/${text}`)
						},
						nestedItems: nestedItems,
					}
				)
			)
		})
	}

	checkout(branch) {
		alert(branch)
	}

	render() {
		const localBranches  = this.renderBranches(this.state.localBranches)
		const remoteBranches = this.renderBranches(this.state.remoteBranches, false)

		const localList = localBranches.length ? (
			e(
				'div',
				null,
				e(Subheader, null, 'Lokální'),
				localBranches
			)
		) : null

		const remoteList = remoteBranches.length ? (
			e(
				'div',
				null,
				e(Subheader, null, 'Vzdálené'),
				remoteBranches
			)
		) : null

		return (
			e(
				'div',
				null,
				e('h2', null, 'Větve'),
				e(
					List,
					null,
					localList,
					remoteList
				)
			)
		)
	}
}


function mapStateToProps(state) {
	return {
		loading: state.loading,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			loading: bindActionCreators(LoadingActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Branches)
