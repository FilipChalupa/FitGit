// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Menu.css';

export default class MenuPage extends Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false" className="navbar-toggle collapsed"><span className="sr-only">Toggle navigation</span><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span></button>
            <Link to="/" className="navbar-brand">Git+LaTeX</Link>
          </div>
          <div id="bs-example-navbar-collapse-1" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><Link to="/commit">Commit</Link></li>
              <li><Link to="/projects">Projekty</Link></li>
              <li><Link to="/history">Historie</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
