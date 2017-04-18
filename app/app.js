const React = require('react')
const e = React.createElement
const render = require('react-dom').render
const Provider = require('react-redux').Provider
const Router = require('react-router').Router
const hashHistory = require('react-router').hashHistory
const syncHistoryWithStore = require('react-router-redux').syncHistoryWithStore
const routes = require('./routes')
const getStore = require('./store/persistentStore')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const injectTapEventPlugin = require('react-tap-event-plugin')

injectTapEventPlugin() // http://stackoverflow.com/questions/24335821/can-i-fastclick-reactjs-running-in-cordova/34015469#34015469


getStore()
	.then((store) => {
		const history = syncHistoryWithStore(hashHistory, store)
		render(
			e(
				Provider,
				{ store },
				e(
					MuiThemeProvider,
					null,
					e(
						Router,
						{
							history,
							routes,
						}
					)
				)
			),
			document.getElementById('root')
		)
	})
	.catch((error) => {
		console.error(error)
	})
