// @flow
import { SET_ACTIVE_PROJECT, REMOVE_PROJECT, SET_PROJECTS } from '../actions/projects'
import compareProjects from '../utils/compareProjects'

export default function project(state = {active: null, list: []}, action) {
  switch (action.type) {
    case SET_ACTIVE_PROJECT:
      return Object.assign({}, state, { active: action.payload })
    case REMOVE_PROJECT:
      return Object.assign({}, state, {
        list: state.list.filter((project) => {
          return !compareProjects(action.payload, project)
        }),
        active: compareProjects(action.payload, state.active) ? null : state.active,
      })
    case SET_PROJECTS:
      return Object.assign({}, state, { list: action.payload })
    default:
      return state
  }
}
