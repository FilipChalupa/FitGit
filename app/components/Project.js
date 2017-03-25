// @flow
import React, { Component } from 'react'
import Branches from './Branches'

export default class Project extends Component {

  render() {
    return (
      <div>
        <h1>Detail projektu</h1>
        <Branches
          project={this.props.projects.active}
        />
      </div>
    )
  }
}
