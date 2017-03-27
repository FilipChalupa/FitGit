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
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import CommitIcon from 'material-ui/svg-icons/action/play-for-work'
import ProjectsIcon from 'material-ui/svg-icons/device/storage'
import ProjectIcon from 'material-ui/svg-icons/action/lightbulb-outline'
import HistoryIcon from 'material-ui/svg-icons/action/settings-backup-restore'
import IntegrateChangesIcon from 'material-ui/svg-icons/action/get-app'
import IntegrateChangesAlertIcon from 'material-ui/svg-icons/av/new-releases'

import * as ProjectsActions from '../actions/projects'
import * as IntegratorActions from '../actions/integrator'

class Menu extends Component {

  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  getItem(path, title, leftIcon, rightIcon = null) {
    return (
      <MenuItem
        key={path}
        onTouchTap={this.handleClose}
        containerElement={<Link to={path} />}
        primaryText={title}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      />
    )
  }

  getItems = () => {
    const items = []
    if (this.props.projects.active) {
      items.push(this.getItem(
        '/project',
        this.props.projects.active.name,
        <ProjectIcon />
      ))
      if (this.props.integrator.available) {
        items.push(this.getItem(
          '/integrateChanges',
          this.props.settings.texts.menu_integrateChanges,
          <IntegrateChangesIcon />,
          <IntegrateChangesAlertIcon />
        ))
      }
      items.push(this.getItem(
        '/commit',
        this.props.settings.texts.menu_commit,
        <CommitIcon />
      ))
    }
    items.push(this.getItem(
      '/projects',
      this.props.settings.texts.menu_projects,
      <ProjectsIcon />
    ))
    if (this.props.projects.active) {
      items.push(this.getItem(
        '/history',
        this.props.settings.texts.menu_history,
        <HistoryIcon />
      ))
    }
    items.push(this.getItem(
      '/settings',
      this.props.settings.texts.menu_settings,
      <SettingsIcon />
    ))
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
          iconClassNameRight='muidocs-icon-navigation-expand-more'
          iconElementLeft={(this.props.integrator.available || null) && (<IconButton><IntegrateChangesAlertIcon /></IconButton>)}
        />

        <Drawer
          open={this.state.open}
          docked={false}
          onRequestChange={(open) => this.setState({ open })}
        >
          <AppBar
            title='Menu'
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
    integrator: state.integrator,
    projects: state.projects,
    settings: state.settings,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      integrator: bindActionCreators(IntegratorActions, dispatch),
      projects: bindActionCreators(ProjectsActions, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
