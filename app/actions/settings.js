const SET_LANGUAGE     = 'SET_LANGUAGE'
const RESET_SETTINGS   = 'RESET_SETTINGS'
const TOGGLE_AUTHOPUSH = 'TOGGLE_AUTHOPUSH'

function setLanguage(language) {
	return {
		type: SET_LANGUAGE,
		payload: language,
	}
}

function resetSettings() {
	return {
		type: RESET_SETTINGS,
	}
}

function toggleAutoPush() {
	return {
		type: TOGGLE_AUTHOPUSH,
	}
}


module.exports = {
	SET_LANGUAGE,
	RESET_SETTINGS,
	TOGGLE_AUTHOPUSH,
	setLanguage,
	resetSettings,
	toggleAutoPush,
}
