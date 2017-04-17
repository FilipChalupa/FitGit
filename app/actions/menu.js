const SET_ACTION        = 'SET_ACTION'
const UNSET_ACTION      = 'UNSET_ACTION'
const CAN_CREATE_COMMIT = 'CAN_CREATE_COMMIT'

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


function canCreateCommit(can) {
	return {
		type: CAN_CREATE_COMMIT,
		payload: can,
	}
}


module.exports = {
	SET_ACTION,
	UNSET_ACTION,
	CAN_CREATE_COMMIT,
	setAction,
	unsetAction,
	canCreateCommit,
}
