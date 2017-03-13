// @flow
export const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT'

export function setActiveProject(project) {
  return {
    type: SET_ACTIVE_PROJECT,
    payload: project,
  }
}