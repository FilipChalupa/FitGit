// @flow
import React, { Component } from 'react'
import Menu from './Menu'
import Loading from './Loading'
import Watcher from './Watcher'

export default class App extends Component {
  props: {
    children: HTMLElement
  }

  render() {
    return (
      <div className="layout">
        <Menu />
        <div className="layout-content">
          {this.props.children}
        </div>
        <Loading />
        <Watcher />
      </div>
    )
  }
}
