const fs = require('fs')

module.exports = (path, content) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, content, (error) => {
			if (error) {
				reject(error)
			}
			resolve()
		})
	})
}
