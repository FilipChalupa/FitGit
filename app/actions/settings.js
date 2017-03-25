// @flow
export const SET_LANGUAGE   = 'SET_LANGUAGE'
export const RESET_SETTINGS = 'RESET_SETTINGS'

export function setLanguage(language) {
  return {
    type: SET_LANGUAGE,
    payload: language,
  }
}

export function resetSettings() {
  return {
    type: RESET_SETTINGS,
    payload: null,
  }
}
