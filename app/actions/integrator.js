const SET_INTEGRATION_AVAILABLE = 'SET_INTEGRATION_AVAILABLE'
const DISMISS_NOTIFICATION      = 'DISMISS_NOTIFICATION'

function setIntegrationAvailable(available, notify) {
	return {
		type: SET_INTEGRATION_AVAILABLE,
		payload: {
			available,
			notify,
		},
	}
}


function dismissNotification() {
	return {
		type: DISMISS_NOTIFICATION,
	}
}


module.exports = {
	SET_INTEGRATION_AVAILABLE,
	DISMISS_NOTIFICATION,
	setIntegrationAvailable,
	dismissNotification,
}
