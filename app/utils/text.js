const loadJsonFile = require('load-json-file')
const path = require('path')

const LANGUAGES_DIR = path.resolve(__dirname, '..', 'languages')

const texts = {}

module.exports = function text(code, key) {
	if (!texts[code]) {
		try {
			texts[code] = loadJsonFile.sync(path.resolve(LANGUAGES_DIR, `${code}.json`))
		} catch (error) {
			texts[code] = []
			console.error(error)
		}
	}
	return texts[code][key] || '-'
}
