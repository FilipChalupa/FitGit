const SET_LANGUAGE = require('../actions/settings').SET_LANGUAGE
const RESET_SETTINGS = require('../actions/settings').RESET_SETTINGS
const TOGGLE_AUTHOPUSH = require('../actions/settings').TOGGLE_AUTHOPUSH
const SET_MERGE_MESSAGE = require('../actions/settings').SET_MERGE_MESSAGE

const defaultSettings = {
	language: 'cs',
	autoPush: true,
	mergeMessage: 'Merge',
}

module.exports = function settings(state = defaultSettings, action) {
	switch (action.type) {
		case SET_LANGUAGE:
			return Object.assign({}, state, {
				language: action.payload,
			})
		case RESET_SETTINGS:
			return Object.assign({}, state, defaultSettings)
		case TOGGLE_AUTHOPUSH:
			return Object.assign({}, state, { autoPush: !state.autoPush })
		case SET_MERGE_MESSAGE:
			return Object.assign({}, state, { mergeMessage: action.payload })
		default:
			return state
	}
}
