const SET_ACTIVE_PROJECT = require('../actions/projects').SET_ACTIVE_PROJECT
const REMOVE_PROJECT = require('../actions/projects').REMOVE_PROJECT
const SET_PROJECTS = require('../actions/projects').SET_PROJECTS
const compareProjects = require('../utils/compareProjects')

module.exports = function project(state = {active: null, list: []}, action) {
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
