const SET_LANGUAGE = require('../actions/settings').SET_LANGUAGE
const RESET_SETTINGS = require('../actions/settings').RESET_SETTINGS
const TOGGLE_AUTHOPUSH = require('../actions/settings').TOGGLE_AUTHOPUSH

const texts = {
	cs: {
		menu_integrateChanges: 'Začlenit změny',
		menu_commit: 'Commit',
		menu_projects: 'Projekty',
		menu_history: 'Historie',
		menu_settings: 'Nastavení',
		settings_language: 'Jazyk',
	},
	en: {
		menu_integrateChanges: 'Integrate changes',
		menu_commit: 'Commit',
		menu_projects: 'Projects',
		menu_history: 'History',
		menu_settings: 'Settings',
		settings_language: 'Language',
	},
	de: {
		menu_integrateChanges: '',
		menu_commit: '',
		menu_projects: '',
		menu_history: '',
		menu_settings: 'Einstellung',
		settings_language: '',
	},
}


const defaultLanguage = 'cs'
const defaultSettings = {
	language: defaultLanguage,
	texts: texts[defaultLanguage],
	autoPush: true,
}

module.exports = function settings(state = defaultSettings, action) {
	switch (action.type) {
		case SET_LANGUAGE:
			return Object.assign({}, state, {
				language: action.payload,
				texts: texts[action.payload] || texts[defaultLanguage],
			})
		case RESET_SETTINGS:
			return Object.assign({}, state, defaultSettings)
		case TOGGLE_AUTHOPUSH:
			return Object.assign({}, state, { autoPush: !state.autoPush })
		default:
			return state
	}
}
