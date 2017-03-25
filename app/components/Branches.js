// @flow
import React, { Component } from 'react'
import {List, ListItem} from 'material-ui/List'
import LabelIcon from 'material-ui/svg-icons/action/label'
import LabelOutlineIcon from 'material-ui/svg-icons/action/label-outline'
import {blue500, red500, greenA200} from 'material-ui/styles/colors'
import nodegit from '../utils/nodegit'

const branchColors = [
  blue500,
  red500,
  greenA200,
]

export default class Branches extends Component {

  constructor(props) {
    super(props)

    this.state = {
      branches: [],
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState(Object.assign({}, this.state, {
        branches: [
          {
            name: 'master',
            branches: []
          },
          {
            name: 'deploy',
            branches: [
              {
                name: 'prod',
                branches: [
                  {
                    name: 'wroclaw',
                    branches: [],
                  },
                  {
                    name: 'sevilla',
                    branches: [],
                  },
                ]
              },
              {
                name: 'beta',
                branches: []
              },
            ],
          },
        ],
      }))
    }, 1000)
  }

  renderBranches(branches, prefix = '', color = null) {
    return branches.map((branch, i) => {
      const groupColor = color || branchColors[i % branchColors.length]
      const Icon = branch.branches.length ? LabelOutlineIcon : LabelIcon
      return (
        <ListItem
          key={i}
          primaryText={prefix + branch.name}
          leftIcon={<Icon
            color={groupColor}
          />}
          initiallyOpen={true}
          nestedItems={this.renderBranches(branch.branches, `${prefix}${branch.name}/`, groupColor)}
        />
      )
    })
  }

  render() {
    return (
      <div>
        <h2>Větve</h2>
        <List>
          {this.renderBranches(this.state.branches)}
        </List>
      </div>
    )
  }
}
