// @flow
import { SET_STATUS, CLOSE_STATUS } from '../actions/status'

export default function project(state = {
  open: false,
  message: '',
  buttonText: null,
  buttonCallback: null,
}, action) {
  switch (action.type) {
    case SET_STATUS:
      return {
        open: true,
        message: action.payload.message,
        buttonText: action.payload.buttonText,
        buttonCallback: action.payload.buttonCallback,
      }
    case CLOSE_STATUS:
      return {
        open: false,
        message: '',
        buttonText: null,
        buttonCallback: null,
      }
    default:
      return state
  }
}
