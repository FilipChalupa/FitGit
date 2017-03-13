// @flow
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

export default class MenuPage extends Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open })


  render() {
    return (
      <div>
        <AppBar
          style={{ position: 'sticky', top: 0 }}
          onLeftIconButtonTouchTap={this.handleToggle}
          title="Git+LaTeX"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />

        <Drawer
          open={this.state.open}
          docked={false}
          onRequestChange={(open) => this.setState({ open })}
        >
          <AppBar
            title="Git+LaTeX"
            iconElementLeft={<IconButton onTouchTap={() => this.setState({ open: false })}><NavigationClose /></IconButton>}
          />

          <MenuItem
            containerElement={<Link to="/commit" />}
            primaryText="Commit"
          />
          <MenuItem
            containerElement={<Link to="/projects" />}
            primaryText="Projekty"
          />
          <MenuItem
            containerElement={<Link to="/history" />}
            primaryText="Historie"
          />
        </Drawer>
      </div>
    );
  }
}
