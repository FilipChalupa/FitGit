// @flow
import React, { Component } from 'react';
import styles from './Projects.css';
import ProjectsList from './ProjectsList';

export default class Projects extends Component {
  render() {
    return (
      <div className="container">
        <h1>Projekty</h1>
        <ProjectsList />
      </div>
    );
  }
}
