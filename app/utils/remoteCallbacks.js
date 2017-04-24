const path = require('path')
const userHome = require('os-homedir')()
const credentialManager = require('git-credential-node')
const nodegit = require('../utils/nodegit').nodegit
const log = require('./log')

module.exports = {
	callbacks: {
		credentials: (url, userName) => {
			if (url.startsWith('http')) {
				let name = ''
				let password = ''
				const credentials = credentialManager.fillSync(url)
				if (credentials) {
					name = credentials.username
					password = credentials.password
				} else {
					log.info('Credential manager not set')
					name = userName
					password = '-'
					credentialManager.approveSync({
						url,
						username: name,
						password,
					})
				}
				return nodegit.Cred.userpassPlaintextNew(name, password)
			} else {
				return nodegit.Cred.sshKeyFromAgent(userName)
			}
		}
	},
}
