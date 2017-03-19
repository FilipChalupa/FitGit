// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { remote } from 'electron'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

import * as ProjectsActions from '../actions/projects'

class MenuPage extends Component {

  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  getItems = () => {
    const items = {
      '/commit': 'Commit',
      '/projects': 'Projekty',
      '/history': 'Historie',
      '/settings': 'Nastavení',
    }
    return Object.keys(items).map((path) => {
      return (
        <MenuItem
          key={path}
          onTouchTap={this.handleClose}
          containerElement={<Link to={path} />}
          primaryText={items[path]}
        />
      )
    })
  }

  handleToggle = () => this.setState({ open: !this.state.open })

  handleClose = () => this.setState({ open: false })

  render() {
    const title = this.props.projects.active ? this.props.projects.active.name : remote.app.getName()

    return (
      <div>
        <AppBar
          style={{ position: 'sticky', top: 0 }}
          onLeftIconButtonTouchTap={this.handleToggle}
          title={title}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />

        <Drawer
          open={this.state.open}
          docked={false}
          onRequestChange={(open) => this.setState({ open })}
        >
          <AppBar
            title={title}
            iconElementLeft={<IconButton onTouchTap={() => this.setState({ open: false })}><NavigationClose /></IconButton>}
          />

          {this.getItems()}
        </Drawer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projects
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProjectsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage)
