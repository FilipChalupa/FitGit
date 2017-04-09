const SET_INTEGRATION_AVAILABLE = require('../actions/integrator').SET_INTEGRATION_AVAILABLE
const notify = require('../utils/notify')
const hashHistory = require('react-router').hashHistory
const remote = require('electron').remote

module.exports = function project(state = { available: false }, action) {
	switch (action.type) {
		case SET_INTEGRATION_AVAILABLE:
			if (action.payload === true && state.available === false) {
				notify('Nové změny', 'zobrazit', () => {
					hashHistory.push('/integrateChanges')
					remote.getCurrentWindow().focus()
				})
			}
			return Object.assign({}, state, { available: action.payload })
		default:
			return state
	}
}
