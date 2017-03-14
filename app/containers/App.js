// @flow
import React, { Component } from 'react';
import Menu from './Menu';

export default class App extends Component {
  props: {
    children: HTMLElement
  };

  render() {
    return (
      <div className="layout">
        <Menu />
        <div className="layout-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
