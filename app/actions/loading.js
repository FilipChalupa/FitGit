// @flow
export const INCREMENT_LOADING_JOBS = 'INCREMENT_LOADING_JOBS'
export const DECREMENT_LOADING_JOBS = 'DECREMENT_LOADING_JOBS'

export function IncrementLoadingJobs() {
  return {
    type: INCREMENT_LOADING_JOBS
  }
}

export function DecrementLoadingJobs() {
  return {
    type: DECREMENT_LOADING_JOBS
  }
}
