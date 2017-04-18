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
				return nodegit.Cred.userpassPlaintextNew(name, password)
			} else {
				return nodegit.Cred.sshKeyFromAgent(userName)
			}
		}
	},
}
