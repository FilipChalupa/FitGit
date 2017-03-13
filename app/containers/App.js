// @flow
import React, { Component } from 'react';
import Menu from './Menu';

export default class App extends Component {
  props: {
    children: HTMLElement
  };

  render() {
    return (
      <div>
        <Menu />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
