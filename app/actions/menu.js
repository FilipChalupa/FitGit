const SET_ACTION        = 'SET_ACTION'
const UNSET_ACTION      = 'UNSET_ACTION'

function setAction(title, route) {
	return {
		type: SET_ACTION,
		payload: {
			title,
			route,
		},
	}
}

function unsetAction() {
	return {
		type: UNSET_ACTION,
	}
}


module.exports = {
	SET_ACTION,
	UNSET_ACTION,
	setAction,
	unsetAction,
}
