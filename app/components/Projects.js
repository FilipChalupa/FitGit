// @flow
import React, { Component } from 'react';
import styles from './Projects.css';
import ProjectsList from './ProjectsList';

export default class Projects extends Component {

  render() {
    return (
      <div>
        <h1>Projekty{this.props.activeProject ? `: ${this.props.activeProject.name}` : ''}</h1>
        <ProjectsList setActiveProject={this.props.setActiveProject} />
      </div>
    );
  }
}
