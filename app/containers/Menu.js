// @flow
import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

export default class MenuPage extends Component {

  constructor(props) {
    super(props)
    this.state = {open: false}
  }

  handleToggle = () => this.setState({open: !this.state.open})


  render() {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleToggle}
          title="Git+LaTeX"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />

        <Drawer
          open={this.state.open}
          docked ={false}
          onRequestChange={(open) => this.setState({open})}
        >
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
