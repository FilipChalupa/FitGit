// @flow
import React, { Component } from 'react'
import ProjectsList from './ProjectsList'
import ProjectAdd from './ProjectAdd'

export default class Projects extends Component {

  render() {

    return (
      <div>
        <h1>Projekty</h1>
        <ProjectsList
          projects={this.props.projects.list}
          activeProject={this.props.projects.active}
          setActiveProject={this.props.setActiveProject}
          removeProject={this.props.removeProject}
          setProjects={this.props.setProjects}
        />
        <ProjectAdd />
      </div>
    );
  }
}
