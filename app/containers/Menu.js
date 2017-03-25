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

  getItem(path, title) {
    return (
      <MenuItem
        key={path}
        onTouchTap={this.handleClose}
        containerElement={<Link to={path} />}
        primaryText={title}
      />
    )
  }

  getItems = () => {
    const staticItems = {
      '/commit': 'menu_commit',
      '/projects': 'menu_projects',
      '/history': 'menu_history',
      '/settings': 'menu_settings',
    }
    const items = []
    if (this.props.projects.active) {
      items.push(this.getItem('/project', this.props.projects.active.name))
    }
    Object.keys(staticItems).forEach((path) => {
      items.push(this.getItem(path, this.props.settings.texts[staticItems[path]]))
    })
    return items
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
    projects: state.projects,
    settings: state.settings,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProjectsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage)
