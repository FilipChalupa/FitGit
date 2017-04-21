const SET_ACTIVE_PROJECT = require('../actions/projects').SET_ACTIVE_PROJECT
const REMOVE_PROJECT = require('../actions/projects').REMOVE_PROJECT
const SET_PROJECTS = require('../actions/projects').SET_PROJECTS
const SET_PROJECT_STATS = require('../actions/projects').SET_PROJECT_STATS
const compareProjects = require('../utils/compareProjects')

const defaultState = Object.freeze({
	active: null,
	list: [],
})

module.exports = function project(state = defaultState, action) {
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
		case SET_PROJECT_STATS:
			const list = state.list.map((project) => {
				if (compareProjects(project, action.payload.project)) {
					return Object.assign({}, project, {
						stats: {
							additions: action.payload.additions,
							removals: action.payload.removals,
							files: action.payload.files,
						},
					})
				} else {
					return project
				}
			})
			return Object.assign({}, state, {
				list,
			})
		default:
			return state
	}
}
