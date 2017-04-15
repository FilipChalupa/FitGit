const React = require('react')
const e = React.createElement
const Route = require('react-router').Route
const IndexRoute = require('react-router').IndexRoute
const App = require('./containers/App')
const HomePage = require('./containers/HomePage')
//const CounterPage = require('./containers/CounterPage')
const CommitPage = require('./containers/CommitPage')
const ProjectsPage = require('./containers/ProjectsPage')
const HistoryPage = require('./containers/HistoryPage')
const SettingsPage = require('./containers/SettingsPage')
const ProjectPage = require('./containers/ProjectPage')
const IntegrateChangesPage = require('./containers/IntegrateChangesPage')
const CommitDetailPage = require('./containers/CommitDetailPage')

module.exports = (
	e(
		Route,
		{
			path: '/',
			component: App,
		},
		e(IndexRoute, { component: HomePage }),
		e(Route, { path:'/', component: HomePage }),
		//e(Route, { path:'/counter', component: CounterPage }),
		e(Route, { path:'/commit', component: CommitPage }),
		e(Route, { path:'/projects', component: ProjectsPage }),
		e(Route, { path:'/history', component: HistoryPage }),
		e(Route, { path:'/settings', component: SettingsPage }),
		e(Route, { path:'/project', component: ProjectPage }),
		e(Route, { path:'/integrateChanges', component: IntegrateChangesPage }),
		e(Route, { path:'/commitDetail/:sha', component: CommitDetailPage })
	)
)
