// @flow
import { SET_ACTIVE_PROJECT } from '../actions/activeProject'

export default function project(state = null, action) {
  switch (action.type) {
    case SET_ACTIVE_PROJECT:
      return action.payload
    default:
      return state
  }
}
