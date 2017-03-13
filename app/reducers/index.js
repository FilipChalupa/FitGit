// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import activeProject from './activeProject';

const rootReducer = combineReducers({
  counter,
  activeProject,
  routing,
});

export default rootReducer;
