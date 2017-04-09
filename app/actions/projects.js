const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT'
const REMOVE_PROJECT     = 'REMOVE_PROJECT'
const SET_PROJECTS       = 'SET_PROJECTS'

function setActiveProject(project) {
	return {
		type: SET_ACTIVE_PROJECT,
		payload: project,
	}
}

function removeProject(project) {
	return {
		type: REMOVE_PROJECT,
		payload: project,
	}
}

function setProjects(projects) {
	return {
		type: SET_PROJECTS,
		payload: projects,
	}
}


module.exports = {
	SET_ACTIVE_PROJECT,
	REMOVE_PROJECT,
	SET_PROJECTS,
	setActiveProject,
	removeProject,
	setProjects,
}
