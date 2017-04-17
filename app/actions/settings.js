const SET_LANGUAGE      = 'SET_LANGUAGE'
const RESET_SETTINGS    = 'RESET_SETTINGS'
const TOGGLE_AUTHOPUSH  = 'TOGGLE_AUTHOPUSH'
const SET_MERGE_MESSAGE = 'SET_MERGE_MESSAGE'

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

function setMergeMessage(message) {
	return {
		type: SET_MERGE_MESSAGE,
		payload: message,
	}
}


module.exports = {
	SET_LANGUAGE,
	RESET_SETTINGS,
	TOGGLE_AUTHOPUSH,
	SET_MERGE_MESSAGE,
	setLanguage,
	resetSettings,
	toggleAutoPush,
	setMergeMessage,
}
