// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import counter from './counter'
import projects from './projects'

const rootReducer = combineReducers({
  counter,
  projects,
  routing,
})

export default rootReducer
