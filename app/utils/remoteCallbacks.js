const path = require('path')
const userHome = require('os-homedir')()
const fillSync = require('git-credential-node').fillSync
const nodegit = require('../utils/nodegit').nodegit

module.exports = {
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
				// return nodegit.Cred.sshKeyFromAgent(userName)
				// @TODO: Use agent if possible
				return nodegit.Cred.sshKeyNew(
					userName,
					path.resolve(path.resolve(userHome, '.ssh/id_rsa')),
					path.resolve(path.resolve(userHome, '.ssh/id_rsa.pub')),
					''
				)
			}
		}
	},
}