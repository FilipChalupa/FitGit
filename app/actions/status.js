const SET_STATUS   = 'SET_STATUS'
const CLOSE_STATUS = 'CLOSE_STATUS'

const STATUS_LIFESPAN = 3000

let statusesQueue = []
let timeout = null

function runQueue(dispatch) {
	timeout = setTimeout(() => {
		if (statusesQueue.length === 0) {
			dispatch(closeStatus())
			timeout = null
		} else {
			dispatch(setStatus(statusesQueue[0]))
			statusesQueue = statusesQueue.slice(1)
			runQueue(dispatch)
		}
	}, STATUS_LIFESPAN)
}

function setStatus(status) {
	return {
		type: SET_STATUS,
		payload: status,
	}
}

function closeStatus() {
	return {
		type: CLOSE_STATUS,
	}
}

function addStatus(message, buttonText, buttonCallback) {
	return (dispatch) => {
		const status = {
			message,
			buttonText,
			buttonCallback: buttonCallback ? () => {
				buttonCallback()
				dispatch(closeStatus())
			} : null,
		}

		if (timeout === null) {
			dispatch(setStatus(status))
			runQueue(dispatch)
		} else {
			statusesQueue.push(status)
		}
	}
}


module.exports = {
	SET_STATUS,
	CLOSE_STATUS,
	closeStatus,
	addStatus,
}
