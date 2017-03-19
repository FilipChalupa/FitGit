import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from './routes'
import getStore from './store/persistentStore'
import './app.global.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin() // http://stackoverflow.com/questions/24335821/can-i-fastclick-reactjs-running-in-cordova/34015469#34015469

getStore()
  .then((store) => {
    const history = syncHistoryWithStore(hashHistory, store)

    render(
      <Provider store={store}>
        <MuiThemeProvider>
          <Router history={history} routes={routes} />
        </MuiThemeProvider>
      </Provider>,
      document.getElementById('root')
    )
  })
  .catch((e) => {
    throw e
  })

/*
const notify = (title, message) => {
  let n = new Notification(title, {
    body: message
  })

  n.onclick = () => {
    console.log('click')
  }
}

import nodegit from './utils/nodegit'
let config
nodegit.Config.openDefault().then((c) => {
  config = c
  return config.getString('user.name')
}).then((username) => {
  notify(`User.name: ${username}`, 'git')
  return config.getString('user.email')
}).then((email) => {
  notify(`User.email: ${email}`, 'git')
})*/


