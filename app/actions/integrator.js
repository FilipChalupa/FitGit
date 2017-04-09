const SET_INTEGRATION_AVAILABLE = 'SET_INTEGRATION_AVAILABLE'

function setIntegrationAvailable(available) {
	return {
		type: SET_INTEGRATION_AVAILABLE,
		payload: available,
	}
}


module.exports = {
	SET_INTEGRATION_AVAILABLE,
	setIntegrationAvailable,
}
