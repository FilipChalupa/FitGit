// @flow
export const SET_INTEGRATION_AVAILABLE = 'SET_INTEGRATION_AVAILABLE'

export function IncrementLoadingJobs(available) {
  return {
    type: SET_INTEGRATION_AVAILABLE,
    payload: available,
  }
}
