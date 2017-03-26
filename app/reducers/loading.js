// @flow
import { INCREMENT_LOADING_JOBS, DECREMENT_LOADING_JOBS, SET_PROJECTS } from '../actions/loading'

export default function project(state = 0, action) {
  switch (action.type) {
    case INCREMENT_LOADING_JOBS:
      return state + 1
    case DECREMENT_LOADING_JOBS:
      return Math.max(0, state - 1)
    default:
      return state
  }
}
