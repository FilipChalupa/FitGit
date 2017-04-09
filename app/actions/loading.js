const INCREMENT_LOADING_JOBS = 'INCREMENT_LOADING_JOBS'
const DECREMENT_LOADING_JOBS = 'DECREMENT_LOADING_JOBS'

function IncrementLoadingJobs() {
	return {
		type: INCREMENT_LOADING_JOBS
	}
}

function DecrementLoadingJobs() {
	return {
		type: DECREMENT_LOADING_JOBS
	}
}


module.exports = {
	INCREMENT_LOADING_JOBS,
	DECREMENT_LOADING_JOBS,
	IncrementLoadingJobs,
	DecrementLoadingJobs,
}
