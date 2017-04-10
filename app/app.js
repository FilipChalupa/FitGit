const React = require('react')
const e = React.createElement
const render = require('react-dom').render
const Provider = require('react-redux').Provider
const Router = require('react-router').Router
const hashHistory = require('react-router').hashHistory
const syncHistoryWithStore = require('react-router-redux').syncHistoryWithStore
const routes = require('./routes')
const getStore = require('./store/persistentStore')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const injectTapEventPlugin = require('react-tap-event-plugin')

injectTapEventPlugin() // http://stackoverflow.com/questions/24335821/can-i-fastclick-reactjs-running-in-cordova/34015469#34015469


getStore()
	.then((store) => {
		const history = syncHistoryWithStore(hashHistory, store)
		render(
			e(
				Provider,
				{ store },
				e(
					MuiThemeProvider,
					null,
					e(
						Router,
						{
							history,
							routes,
						}
					)
				)
			),
			document.getElementById('root')
		)
	})
	.catch((error) => {
		console.error(error)
	})




/*
const nodegit = require('nodegit')
const path = require('path')
const credentials = require('git-credential-node')
const userHome = require('os-homedir')()


console.log(nodegit)

const remoteName = 'ssh'

const fetchOptions = {
	callbacks: {
		credentials: (url, userName) => {
			if (url.startsWith('http')) {
				let name = ''
				let password = ''
				try {
					const c = credentials.fillSync(url)
					name = c.username
					password = c.password
				} catch (error) {
					console.error(error)
				}
				// @TODO: Get actual password if not stored
				return nodegit.Cred.userpassPlaintextNew(name, password)
			} else {
				// return nodegit.Cred.sshKeyFromAgent(userName)
				return nodegit.Cred.sshKeyNew(
					userName,
					path.resolve(path.resolve(userHome, '.ssh/id_rsa')),
					path.resolve(path.resolve(userHome, '.ssh/id_rsa.pub')),
					''
				)
			}
		}
	}
}

const repoPath = path.resolve('C:\\z\\temp\\bp-test')

let lastKnownCommitHash
let repo

nodegit.Repository.open(repoPath)
	.then((r) => {
		repo = r
		return repo.getBranchCommit(`${remoteName}/master`) // @TODO: get main branch
	})
	.then((commit) => {
		return commit.sha()
	})
	.catch((e) => {
		return null
	})
	.then((commitHash) => {
		lastKnownCommitHash = commitHash
		return repo.fetch(remoteName, fetchOptions) // @TODO: get remote name
	})
	.then(() => {
		return repo.getBranchCommit(`${remoteName}/master`)
	})
	.then((commit) => {
		console.log(commit.sha(), '!==', lastKnownCommitHash)
		if (commit.sha() !== lastKnownCommitHash) {
			console.log('Update jej')
		}
	})
	.catch((e) => {
		console.error(e)
	})
	.then(() => {
		console.log('Done')
	})
*/
