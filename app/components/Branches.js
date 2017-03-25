// @flow
import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import LabelIcon from 'material-ui/svg-icons/action/label'
import LabelOutlineIcon from 'material-ui/svg-icons/action/label-outline'
import {
  red500,
  pink500,
  purple500,
  deepPurple500,
  indigo500,
  blue500,
  green500,
  lightGreen500,
  lime500,
  yellow500,
  amber500,
  orange500,
  deepOrange500,
  brown500,
} from 'material-ui/styles/colors'
import nodegit, { getLocalBranches, getRemoteBranches } from '../utils/nodegit'

const branchColors = [
  red500,
  lightGreen500,
  blue500,
  yellow500,
  pink500,
  orange500,
  purple500,
  green500,
  brown500,
  deepOrange500,
  deepPurple500,
  lime500,
  indigo500,
  amber500,
]

export default class Branches extends Component {

  constructor(props) {
    super(props)

    this.state = {
      localBranches: {},
      remoteBranches: {},
    }
  }

  componentDidMount() {
    getLocalBranches(this.props.project.path)
      .then((branches) => {
        this.setState(Object.assign({}, this.state, {
          localBranches: this.makeTrees(branches),
        }))
      })
      .catch((error) => {
        console.error(error)
      })
    getRemoteBranches(this.props.project.path)
      .then((branches) => {
        this.setState(Object.assign({}, this.state, {
          remoteBranches: this.makeTrees(branches),
        }))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  makeTrees(branches) {
    const trees = {}
    branches.forEach((branch) => {
      const parts = branch.split('/')
      let i = 0
      let t = trees
      while (i < parts.length) {
        if (t[parts[i]] === undefined) {
          t[parts[i]] = {}
        }
        t = t[parts[i]]
        i++
      }
    })
    return trees
  }

  renderBranches(branches, isLocal = true, prefix = '', color = null) {
    return branches && Object.keys(branches).map((branch, i) => {
      const groupColor = color || branchColors[i % branchColors.length]
      const nestedItems = this.renderBranches(branches[branch], isLocal, `${prefix}${branch}/`, groupColor)
      const Icon = nestedItems.length ? LabelOutlineIcon : LabelIcon
      return (
        <ListItem
          key={i}
          primaryText={prefix + branch}
          leftIcon={<Icon
            color={groupColor}
          />}
          initiallyOpen={isLocal}
          primaryTogglesNestedList={nestedItems.length !== 0}
          /*onTouchTap={() => {alert('@TODO')}}*/
          nestedItems={nestedItems}
        />
      )
    })
  }

  render() {
    const localBranches  = this.renderBranches(this.state.localBranches)
    const remoteBranches = this.renderBranches(this.state.remoteBranches, false)

    const localList = localBranches.length ? (
      <div>
        <Subheader>Lokální</Subheader>
        {localBranches}
      </div>
    ) : null

    const remoteList = remoteBranches.length ? (
      <div>
        <Subheader>Vzdálené</Subheader>
        {remoteBranches}
      </div>
    ) : null

    return (
      <div>
        <h2>Větve</h2>
        <List>
          {localList}
          {remoteList}
        </List>
      </div>
    )
  }
}
