// @flow
import { remote } from 'electron'
import { SET_LANGUAGE } from '../actions/settings'

const defaultSettings = {
  language: remote.app.getLocale(),
}

export default function settings(state = defaultSettings, action) {
  switch (action.type) {
    case SET_LANGUAGE:
      return Object.assign({}, state, { language: action.payload })
    default:
      return state
  }
}
