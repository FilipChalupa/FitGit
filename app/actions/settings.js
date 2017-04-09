const SET_LANGUAGE   = 'SET_LANGUAGE'
const RESET_SETTINGS = 'RESET_SETTINGS'

function setLanguage(language) {
	return {
		type: SET_LANGUAGE,
		payload: language,
	}
}

function resetSettings() {
	return {
		type: RESET_SETTINGS,
		payload: null,
	}
}


module.exports = {
	SET_LANGUAGE,
	RESET_SETTINGS,
	setLanguage,
	resetSettings,
}
