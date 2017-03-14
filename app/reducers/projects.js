// @flow
import { SET_ACTIVE_PROJECT, SET_PROJECTS } from '../actions/projects'

export default function project(state = {active: null, list: []}, action) {
  switch (action.type) {
    case SET_ACTIVE_PROJECT:
      return Object.assign({}, state, { active: action.payload })
    case SET_PROJECTS:
      return Object.assign({}, state, { list: action.payload })
    default:
      return state
  }
}
