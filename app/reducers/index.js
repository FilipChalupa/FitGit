// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import counter from './counter'
import loading from './loading'
import integrator from './integrator'
import projects from './projects'
import settings from './settings'
import status from './status'

const rootReducer = combineReducers({
  counter,
  loading,
  integrator,
  projects,
  routing,
  settings,
  status,
})

export default rootReducer
