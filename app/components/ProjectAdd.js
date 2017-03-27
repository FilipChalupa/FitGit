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
import {Tabs, Tab} from 'material-ui/Tabs'
import * as ProjectsActions from '../actions/projects'
import * as StatusActions from '../actions/status'

const dialog = require('electron').remote.dialog
const path = require('path')

const TAB_NEW   = 'TAB_NEW'
const TAB_URL   = 'TAB_URL'
const TAB_LOCAL = 'TAB_LOCAL'

class ProjectAdd extends Component {

  constructor(props) {
    super(props)

    this.state = {
      openAddModal: false,
      directoryPath: '',
      url: '',
      active: TAB_NEW,
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

  setActiveTab = (active) => {
    const newState = Object.assign({}, this.state, { active })
    this.setState(newState)
  }

  handlePathChange = (e, value) => {
    const newState = Object.assign({}, this.state, { directoryPath: value })
    this.setState(newState)
  }

  handleURLChange = (e, value) => {
    const newState = Object.assign({}, this.state, { url: value })
    this.setState(newState)
  }

  appendProject = (project) => {
    const newProjects = this.props.projects.list.concat([project])
    this.props.actions.projects.setProjects(newProjects)
  }

  getURLField() {
    return (
      <TextField
        name="url"
        type="url"
        hintText="Adresa repozitáře"
        value={this.state.url}
        onChange={this.handleURLChange}
      />
    )
  }

  getDirectoryField() {
    return (
      <div>
        <TextField
          name="path"
          hintText="Umístění v tomto zařízení"
          value={this.state.directoryPath}
          onChange={this.handlePathChange}
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

  openAddModal = (open) => {
    const newState = Object.assign({}, this.state, { openAddModal: open })
    this.setState(newState)
  }

  addProject = () => {
    const url = this.state.url // @TODO: init empty project if possible
    const localPath = this.state.directoryPath
    const project = {
      name: path.basename(localPath),
      note: localPath,
      path: localPath,
    }
    this.appendProject(project)
    this.openAddModal(false)

    this.props.actions.status.addStatus(
      `Byl přidán projekt: ${project.name}`,
      'Vrátit zpět',
      () => {
        this.props.actions.projects.removeProject(project)
      }
    )
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
          actions={actions}
          onRequestClose={() => this.openAddModal(false)}
          open={this.state.openAddModal}
        >
          <Tabs>
            <Tab
              label="Nový projekt"
              onActive={() => this.setActiveTab(TAB_NEW)}
            >
              <div>
                <p>
                  Zvolte adresář, ze kterého se vytvoří nový projekt. Adresář může obsahovat již rozpracované dílo.
                </p>
                {this.getDirectoryField()}
              </div>
            </Tab>
            <Tab
              label="Z URL"
              onActive={() => this.setActiveTab(TAB_URL)}
            >
              <div>
                <p>
                  Zvolte adresu, ze které se stáhne existující projekt do místního adresáře.
                </p>
                {this.getURLField()}
                {this.getDirectoryField()}
              </div>
            </Tab>
            <Tab
              label="Z adresáře"
              onActive={() => this.setActiveTab(TAB_LOCAL)}
            >
              <div>
                <p>
                  Zvolte adresář, který obsahuje již existující projekt.
                </p>
                {this.getDirectoryField()}
              </div>
            </Tab>
          </Tabs>
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
      status: bindActionCreators(StatusActions, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectAdd)
