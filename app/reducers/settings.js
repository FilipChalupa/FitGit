// @flow
import { SET_LANGUAGE, RESET_SETTINGS } from '../actions/settings'

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
}

export default function settings(state = defaultSettings, action) {
  switch (action.type) {
    case SET_LANGUAGE:
      return Object.assign({}, state, {
        language: action.payload,
        texts: texts[action.payload] || texts[defaultLanguage],
      })
    case RESET_SETTINGS:
      return Object.assign({}, state, defaultSettings)
    default:
      return state
  }
}
