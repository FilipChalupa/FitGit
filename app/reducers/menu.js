const SET_ACTION = require('../actions/menu').SET_ACTION
const UNSET_ACTION = require('../actions/menu').UNSET_ACTION

const defaultState = Object.freeze({
	action: null,
})

module.exports = function project(state = {active: null, list: []}, action) {
	switch (action.type) {
		case SET_ACTION:
			return Object.assign({}, state, { action: action.payload })
		case UNSET_ACTION:
			return Object.assign({}, state, { action: null })
		default:
			return state
	}
}
