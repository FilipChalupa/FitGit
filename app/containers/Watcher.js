const React = require('react')
const e = React.createElement
const Component = React.Component
const connect = require('react-redux').connect
const bindActionCreators = require('redux').bindActionCreators
const nodegit = require('../utils/nodegit')
const fillSync = require('git-credential-node').fillSync

const ProjectsActions = require('../actions/projects')
const IntegratorActions = require('../actions/integrator')

const CHECK_INTERVAL = 1500

class Watcher extends Component {

	constructor(props) {
		super(props)

		this.fetchOptions = {
			callbacks: {
				credentials: (url, userName) => {
					if (url.startsWith('http')) {
						let name = ''
						let password = ''
						try {
							const credentials = fillSync(url)
							name = credentials.username
							password = credentials.password
						} catch (error) {
							console.error(error)
						}
						// @TODO: Get actual password if not stored
						return nodegit.Cred.userpassPlaintextNew(name, password)
					} else {
						return nodegit.Cred.sshKeyFromAgent(userName)
					}
				}
			}
		}
	}

	componentDidMount() {
		//this.check()

		if (this.props.projects.active) { // @TODO: remove - for preview only
			setTimeout(() => {
				this.props.actions.integrator.setIntegrationAvailable(true)
			}, 5000)
		}
	}

	check() {
		let lastKnownCommitHash
		let repo

		if (!this.props.projects.active) {
			setTimeout(() => {
				this.check() // @TODO: stop checking if projects.active === null
			}, CHECK_INTERVAL)
			return
		}

		nodegit.Repository.open(this.props.projects.active.path)
			.then((r) => {
				repo = r
				return repo.getBranchCommit('origin/master') // @TODO: get main branch
			})
			.then((commit) => {
				return commit.sha()
			})
			.catch((e) => {
				return null
			})
			.then((commitHash) => {
				lastKnownCommitHash = commitHash
				return repo.fetch('origin', this.fetchOptions) // @TODO: get remote name
			})
			.then(() => {
				return repo.getBranchCommit('origin/master')
			})
			.then((commit) => {
				console.log(commit.sha(), '!==', lastKnownCommitHash)
				if (commit.sha() !== lastKnownCommitHash) {
					this.props.integrator.setIntegrationAvailable(true)
				}
			})
			.catch((e) => {
				console.error(e)
			})
			.then(() => {
				setTimeout(() => {
					this.check()
				}, CHECK_INTERVAL)
			})

	}

	render() {
		return null
	}
}


function mapStateToProps(state) {
	return {
		integrator: state.integrator,
		projects: state.projects,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			integrator: bindActionCreators(IntegratorActions, dispatch),
			projects: bindActionCreators(ProjectsActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Watcher)
