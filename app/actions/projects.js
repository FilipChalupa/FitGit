const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT'
const REMOVE_PROJECT     = 'REMOVE_PROJECT'
const SET_PROJECTS       = 'SET_PROJECTS'
const SET_PROJECT_STATS  = 'SET_PROJECT_STATS'

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

function updateProjectStats(project, additions, removals, files) {
	return {
		type: SET_PROJECT_STATS,
		payload: {
			project,
			additions,
			removals,
			files,
		},
	}
}


module.exports = {
	SET_ACTIVE_PROJECT,
	REMOVE_PROJECT,
	SET_PROJECTS,
	SET_PROJECT_STATS,
	setActiveProject,
	removeProject,
	setProjects,
	updateProjectStats,
}
