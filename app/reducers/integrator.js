// @flow
import { SET_INTEGRATION_AVAILABLE } from '../actions/integrator'
import notify from '../utils/notify'
import { hashHistory } from 'react-router'
import { remote } from 'electron'

export default function project(state = { available: false }, action) {
  switch (action.type) {
    case SET_INTEGRATION_AVAILABLE:
      if (action.payload === true && state.available === false) {
        notify('Nové změny', 'zobrazit', () => {
          hashHistory.push('/integrateChanges')
          remote.getCurrentWindow().focus()
        })
      }
      return Object.assign({}, state, { available: action.payload })
    default:
      return state
  }
}
