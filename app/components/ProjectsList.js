// @flow
import React, { Component } from 'react'

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import IconAdd from 'material-ui/svg-icons/content/add-box'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import TextField from 'material-ui/TextField'

const iconAdd = <IconAdd />

const styles = {
  uploadButton: {
    verticalAlign: 'middle',
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
}

export default class ProjectsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0,
      openAddModal: false,
      projects: [{
        name: 'Test'
      },{
        name: 'Lumen'
      }],
    }
  }

  openAddModal = (open) => {
    const newState = Object.assign({}, this.state, { openAddModal: open })
    this.setState(newState)
  }

  renderProjects() {
    return this.state.projects.map((project, i) => {
      return (
          <Card key={i} style={{ marginBottom: '20px'}}>
            <CardHeader
              title={project.name}
              subtitle="Subtitle"
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardActions>
              <FlatButton label="Zvolit" />
            </CardActions>
            <CardText expandable={true}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
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
        disabled={true}
        onTouchTap={this.openAddModal}
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

          <RadioButtonGroup name="addType" defaultSelected="from_url">
            <RadioButton
              value="from_url"
              label="Z URL"
            />
            <RadioButton
              value="from_filesystem"
              label="Z lokálního adresáře"
            />
          </RadioButtonGroup>

          <TextField
            name="url"
            type="url"
            hintText="git@github.com:Onset/git-latex.git"
          />
          <TextField
            name="path"
            hintText="cesta"
          />
          <FlatButton
            label="Vybrat adresář"
            labelPosition="before"
            style={styles.uploadButton}
            containerElement="label"
            onTouchTap={() => this.openAddModal(false)}
          >
            <input type="file" style={styles.uploadInput} />
          </FlatButton>

        </Dialog>

        <Paper
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
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
