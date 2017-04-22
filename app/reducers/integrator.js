const SET_INTEGRATION_AVAILABLE = require('../actions/integrator').SET_INTEGRATION_AVAILABLE
const DISMISS_NOTIFICATION = require('../actions/integrator').DISMISS_NOTIFICATION
const SET_COMMIT_AVAILABLE = require('../actions/integrator').SET_COMMIT_AVAILABLE
const DISMISS_COMMIT_NOTIFICATION = require('../actions/integrator').DISMISS_COMMIT_NOTIFICATION
const notify = require('../utils/notify')
const redirectWithReload = require('../utils/redirectWithReload')

const defaultState = Object.freeze({
	available: false,
	notification: false,
	commitAvailable: false,
	commitNotification: false,
})

module.exports = function integrator(state = defaultState, action) {
	switch (action.type) {
		case SET_INTEGRATION_AVAILABLE:
			if (action.payload.available && !state.notification && action.payload.notify) {
				notify('Nové změny k dispozici', 'zobrazit', () => {
					redirectWithReload('/integrateChanges')
				})
			}
			return Object.assign({}, state, {
				available: action.payload.available,
				notification: action.payload.available && (state.notification || action.payload.notify),
			})
		case SET_COMMIT_AVAILABLE:
			if (action.payload.available && !state.commitNotification && action.payload.notify) {
				notify('Máte nenasdílené změny', 'možná je čas udělat commit', () => {
					redirectWithReload('/commit')
				})
			}
			return Object.assign({}, state, {
				commitAvailable: action.payload.available,
				commitNotification: action.payload.available && (state.commitNotification || action.payload.notify),
			})
		case DISMISS_NOTIFICATION:
			return Object.assign({}, state, {
				notification: false,
			})
		case DISMISS_COMMIT_NOTIFICATION:
			return Object.assign({}, state, {
				commitNotification: false,
			})
		default:
			return state
	}
}
