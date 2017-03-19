// @flow
export const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT'
export const REMOVE_PROJECT     = 'REMOVE_PROJECT'
export const SET_PROJECTS       = 'SET_PROJECTS'

export function setActiveProject(project) {
  return {
    type: SET_ACTIVE_PROJECT,
    payload: project,
  }
}

export function removeProject(project) {
  return {
    type: REMOVE_PROJECT,
    payload: project,
  }
}

export function setProjects(projects) {
  return {
    type: SET_PROJECTS,
    payload: projects,
  }
}