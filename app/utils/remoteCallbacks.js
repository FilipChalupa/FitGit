const path = require('path')
const userHome = require('os-homedir')()
const fillSync = require('git-credential-node').fillSync
const nodegit = require('../utils/nodegit').nodegit
const log = require('./log')

const passwords = {}

module.exports = {
	callbacks: {
		credentials: (url, userName) => {
			if (url.startsWith('http')) {
				let name = ''
				let password = ''
				const credentials = fillSync(url)
				if (credentials) {
					name = credentials.username
					password = credentials.password
				} else {
					log.info('Credential manager not set')
					name = userName
					const key = `${userName}--${url}`
					if (!passwords[key]) {
						passwords[key] = 'fake password'
					}
					password = passwords[key]
				}
				return nodegit.Cred.userpassPlaintextNew(name, password)
			} else {
				return nodegit.Cred.sshKeyFromAgent(userName)
			}
		}
	},
}
