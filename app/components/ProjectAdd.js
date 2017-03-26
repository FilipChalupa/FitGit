// @flow
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import IconAdd from 'material-ui/svg-icons/content/add-box'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import * as ProjectsActions from '../actions/projects'

const dialog = require('electron').remote.dialog
const path = require('path')

class ProjectAdd extends Component {

  constructor(props) {
    super(props)

    this.state = {
      addType: 'new',
      openAddModal: false,
      addDirectoryPath: '',
    }
  }

  getDirectory = () => {
    const dialogDirectories = dialog.showOpenDialog({properties: ['openDirectory']})
    if (!dialogDirectories) {
      return
    }
    const repoDirectory = dialogDirectories[0] // @TODO: Validate repository exists

    this.handlePathChange(null, repoDirectory)
  }

  handleTypeChange = (e, value) => {
    const newState = Object.assign({}, this.state, { addType: value })
    this.setState(newState)
  }

  openAddModal = (open) => {
    const newState = Object.assign({}, this.state, { openAddModal: open })
    this.setState(newState)
  }

  handlePathChange = (e, value) => {
    const newState = Object.assign({}, this.state, { addDirectoryPath: value })
    this.setState(newState)
  }

  appendProject = (project) => {
    const newProjects = this.props.projects.list.concat([project])
    this.props.actions.projects.setProjects(newProjects)
  }

  addOptions() {
    return (
      <div>
        <TextField
          name="url"
          type="url"
          hintText="Adresa repozitáře"
          disabled={this.state.addType !== 'from_url'}
          ref='urlInput'
        />
        <br />
        <TextField
          name="path"
          hintText="Umístění v tomto zařízení"
          value={this.state.addDirectoryPath}
          onChange={this.handlePathChange}
          ref='pathInput'
        />
        <FlatButton
          label="Zvolit adresář"
          style={{
            verticalAlign: 'middle',
          }}
          onTouchTap={this.getDirectory}
        >
        </FlatButton>
      </div>
    )
  }

  addProject = () => {
    const url = this.refs.urlInput.input.value // @TODO: init empty project if possible
    const localPath = this.refs.pathInput.input.value
    this.appendProject({
      name: path.basename(localPath),
      note: localPath,
      path: localPath,
    })
    this.openAddModal(false)
  }

  render() {
    const actions = [
      <FlatButton
        label="Přidat"
        primary={true}
        onTouchTap={this.addProject}
      />,
      <FlatButton
        label="Zrušit"
        onTouchTap={() => this.openAddModal(false)}
      />,
    ]

    return (
      <div>
        <Dialog
          title="Přidat projekt"
          actions={actions}
          onRequestClose={() => this.openAddModal(false)}
          open={this.state.openAddModal}
        >

          <RadioButtonGroup
            name="addType"
            valueSelected={this.state.addType}
            onChange={this.handleTypeChange}
          >
            <RadioButton
              value="new"
              label="Vytvořit nový"
            />
            <RadioButton
              value="from_url"
              label="Z URL"
            />
            <RadioButton
              value="from_filesystem"
              label="Z lokálního adresáře"
            />
          </RadioButtonGroup>

          {this.addOptions()}

        </Dialog>

        <Paper
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}>
          <BottomNavigation>
            <BottomNavigationItem
              label="Přidat"
              icon={<IconAdd />}
              onTouchTap={() => this.openAddModal(true)}
            />
          </BottomNavigation>
        </Paper>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    projects: state.projects,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      projects: bindActionCreators(ProjectsActions, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectAdd)
