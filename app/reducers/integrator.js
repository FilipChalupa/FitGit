// @flow
import { SET_INTEGRATION_AVAILABLE } from '../actions/integrator'
import notify from '../utils/notify'

export default function project(state = { available: false }, action) {
  switch (action.type) {
    case SET_INTEGRATION_AVAILABLE:
      notify('Nové změny', 'zobrazit')
      return Object.assign({}, state, { available: action.payload })
    default:
      return state
  }
}
