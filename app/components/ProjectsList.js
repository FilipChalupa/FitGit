// @flow
import React, { Component } from 'react'

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import compareProjects from '../utils/compareProjects'

export default class ProjectsList extends Component {

  renderProjects() {
    if (this.props.projects.length === 0) {
      return (
        <div>
          Zatím nemáte žádný projekt. Nový přidáte plačítkem plus v dolní části.
        </div>
      )
    }
    return this.props.projects.map((project, i) => {
      const style = {
        marginBottom: '20px',
      }
      if (compareProjects(project, this.props.activeProject)) {
        style.backgroundColor = 'rgb(240, 240, 240)'
      }
      return (
          <Card
            key={i}
            style={style}
          >
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
                primary={true}
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

    return (
      <div>
        {projects}
      </div>
    )
  }
}
