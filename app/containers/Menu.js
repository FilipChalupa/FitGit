// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

import * as ActiveProjectActions from '../actions/activeProject'

class MenuPage extends Component {

  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  handleToggle = () => this.setState({ open: !this.state.open })


  render() {
    const title = this.props.activeProject ? this.props.activeProject.name : 'Git+LaTeX'

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
    )
  }
}

function mapStateToProps(state) {
  return {
    activeProject: state.activeProject
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActiveProjectActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage)