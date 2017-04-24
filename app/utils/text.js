const path = require('path')
const fsp = require('fs-promise')
const log = require('./log')

const LANGUAGES_DIR = path.resolve(__dirname, '..', 'languages')
const DEFAULT_LANGUAGE_CODE = 'cs'

const texts = {}

function getTranslation(code, key) {
	if (!texts[code]) {
		try {
			texts[code] = fsp.readJsonSync(path.resolve(LANGUAGES_DIR, `${code}.json`))
		} catch (error) {
			texts[code] = []
			log.error(error)
		}
	}
	return texts[code][key] || null
}

function text(code, key) {
	const requestedLanguageText = getTranslation(code, key)
	if (requestedLanguageText === null) {
		return getTranslation(DEFAULT_LANGUAGE_CODE, key) || ''
	}
	return requestedLanguageText || ''
}


module.exports = text
