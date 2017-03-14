// @flow
import React, { Component } from 'react';
import ProjectsList from './ProjectsList';

export default class Projects extends Component {

  render() {
    return (
      <div>
        <h1>Projekty</h1>
        <ProjectsList
          projects={this.props.projects.list}
          setActiveProject={this.props.setActiveProject}
          setProjects={this.props.setProjects}
        />
      </div>
    );
  }
}
