// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import counter from './counter'
import loading from './loading'
import integrator from './integrator'
import projects from './projects'
import settings from './settings'

const rootReducer = combineReducers({
  counter,
  loading,
  integrator,
  projects,
  routing,
  settings,
})

export default rootReducer
