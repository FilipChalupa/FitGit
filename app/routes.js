// @flow
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import HomePage from './containers/HomePage'
import CounterPage from './containers/CounterPage'
import CommitPage from './containers/CommitPage'
import ProjectsPage from './containers/ProjectsPage'
import HistoryPage from './containers/HistoryPage'
import SettingsPage from './containers/SettingsPage'
import ProjectPage from './containers/ProjectPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/counter" component={CounterPage} />
    <Route path="/commit" component={CommitPage} />
    <Route path="/projects" component={ProjectsPage} />
    <Route path="/history" component={HistoryPage} />
    <Route path="/settings" component={SettingsPage} />
    <Route path="/project" component={ProjectPage} />
  </Route>
)
