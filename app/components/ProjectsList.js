// @flow
import React, { Component } from 'react'

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import IconAdd from 'material-ui/svg-icons/content/add-box'
import Dialog from 'material-ui/Dialog'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import TextField from 'material-ui/TextField'

const dialog = require('electron').remote.dialog
const path = require('path')

const iconAdd = <IconAdd />

const styles = {
  uploadButton: {
    verticalAlign: 'middle',
  },
}

export default class ProjectsList extends Component {

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
    const newProjects = this.props.projects.concat([project])
    this.props.setProjects(newProjects)
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
          style={styles.uploadButton}
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

  renderProjects() {
    return this.props.projects.map((project, i) => {
      return (
          <Card key={i} style={{ marginBottom: '20px'}}>
            <CardHeader
              title={project.name}
              subtitle={project.note}
              actAsExpander={false}
              style={{
                cursor: 'pointer',
              }}
              /*showExpandableButton={true}*/
              onTouchTap={() => this.props.setActiveProject(project)}
            />
            <CardActions>
              <RaisedButton
                label="Zvolit"
                onTouchTap={() => this.props.setActiveProject(project)}
              />
              <FlatButton
                label="Odebrat"
                onTouchTap={() => this.props.removeProject(project)}
              />
            </CardActions>
            {/*<CardText expandable={true}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>*/}
          </Card>
      )
    })
  }

  render() {
    const projects = this.renderProjects()

    const actions = [
      <FlatButton
        label="Přidat"
        primary={true}
        onTouchTap={this.addProject}
      />,
      <FlatButton
        label="Cancel"
        onTouchTap={() => this.openAddModal(false)}
      />,
    ]

    return (
      <div>
        {projects}

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
              icon={iconAdd}
              onTouchTap={() => this.openAddModal(true)}
            />
          </BottomNavigation>
        </Paper>
      </div>
    )
  }
}
