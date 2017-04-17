const SET_ACTION = require('../actions/menu').SET_ACTION
const UNSET_ACTION = require('../actions/menu').UNSET_ACTION
const CAN_CREATE_COMMIT = require('../actions/menu').CAN_CREATE_COMMIT

const defaultState = Object.freeze({
	action: null,
	list: [],
	canCreateCommit: false,
})

module.exports = function menu(state = defaultState, action) {
	switch (action.type) {
		case SET_ACTION:
			return Object.assign({}, state, { action: action.payload })
		case UNSET_ACTION:
			return Object.assign({}, state, { action: null })
		case CAN_CREATE_COMMIT:
			return Object.assign({}, state, { canCreateCommit: action.payload })
		default:
			return state
	}
}
