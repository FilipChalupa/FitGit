const INCREMENT_LOADING_JOBS = require('../actions/loading').INCREMENT_LOADING_JOBS
const DECREMENT_LOADING_JOBS = require('../actions/loading').DECREMENT_LOADING_JOBS
const SET_PROJECTS = require('../actions/loading').SET_PROJECTS

module.exports = function project(state = 0, action) {
	switch (action.type) {
		case INCREMENT_LOADING_JOBS:
			return state + 1
		case DECREMENT_LOADING_JOBS:
			return Math.max(0, state - 1)
		default:
			return state
	}
}
