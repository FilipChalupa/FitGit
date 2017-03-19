// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import counter from './counter'
import projects from './projects'
import settings from './settings'

const rootReducer = combineReducers({
  counter,
  projects,
  routing,
  settings,
})

export default rootReducer
