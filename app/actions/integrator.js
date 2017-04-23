const SET_INTEGRATION_AVAILABLE   = 'SET_INTEGRATION_AVAILABLE'
const DISMISS_NOTIFICATION        = 'DISMISS_NOTIFICATION'
const SET_COMMIT_AVAILABLE        = 'SET_COMMIT_AVAILABLE'
const DISMISS_COMMIT_NOTIFICATION = 'DISMISS_COMMIT_NOTIFICATION'

function setIntegrationAvailable(available, notify, title, message, route) {
	return {
		type: SET_INTEGRATION_AVAILABLE,
		payload: {
			available,
			notify,
			title,
			message,
			route,
		},
	}
}


function setCommitAvailable(available, notify, title, message, route) {
	return {
		type: SET_COMMIT_AVAILABLE,
		payload: {
			available,
			notify,
			title,
			message,
			route,
		},
	}
}


function dismissNotification() {
	return {
		type: DISMISS_NOTIFICATION,
	}
}


function dismissCommitNotification() {
	return {
		type: DISMISS_COMMIT_NOTIFICATION,
	}
}


module.exports = {
	SET_INTEGRATION_AVAILABLE,
	DISMISS_NOTIFICATION,
	SET_COMMIT_AVAILABLE,
	DISMISS_COMMIT_NOTIFICATION,
	setIntegrationAvailable,
	setCommitAvailable,
	dismissNotification,
	dismissCommitNotification,
}
