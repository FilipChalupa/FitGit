const SET_INTEGRATION_AVAILABLE = require('../actions/integrator').SET_INTEGRATION_AVAILABLE
const DISMISS_NOTIFICATION = require('../actions/integrator').DISMISS_NOTIFICATION
const notify = require('../utils/notify')
const redirectWithReload = require('../utils/redirectWithReload')

const defaultState = Object.freeze({
	available: false,
	notification: false,
})

module.exports = function project(state = defaultState, action) {
	switch (action.type) {
		case SET_INTEGRATION_AVAILABLE:
			if (action.payload.available && !state.notification && action.payload.notify) {
				notify('Nové změny k dispozici', 'zobrazit', () => {
					redirectWithReload('/integrateChanges')
				})
			}
			return Object.assign({}, state, {
				available: action.payload.available,
				notification: state.notification || action.payload.notify,
			})
		case DISMISS_NOTIFICATION:
			return Object.assign({}, state, {
				notification: false,
			})
		default:
			return state
	}
}
