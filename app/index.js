import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from './routes'
import configureStore from './store/configureStore'
import './app.global.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin() // http://stackoverflow.com/questions/24335821/can-i-fastclick-reactjs-running-in-cordova/34015469#34015469

const store = configureStore()
const history = syncHistoryWithStore(hashHistory, store)

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history} routes={routes} />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)


const remote = require('electron').remote
const nodegit = remote.require('nodegit')
let config
nodegit.Config.openDefault().then((c) => {
  config = c
  return config.getString('user.name')
}).then((username) => {
  alert(`User.name: ${username}`)
  return config.getString('user.email')
}).then((email) => {
  alert(`User.email: ${email}`)
})
