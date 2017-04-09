const SET_STATUS = require( '../actions/status').SET_STATUS
const CLOSE_STATUS = require( '../actions/status').CLOSE_STATUS

module.exports = function project(state = {
	open: false,
	message: '',
	buttonText: null,
	buttonCallback: null,
}, action) {
	switch (action.type) {
		case SET_STATUS:
			return {
				open: true,
				message: action.payload.message,
				buttonText: action.payload.buttonText,
				buttonCallback: action.payload.buttonCallback,
			}
		case CLOSE_STATUS:
			return {
				open: false,
				message: '',
				buttonText: null,
				buttonCallback: null,
			}
		default:
			return state
	}
}
