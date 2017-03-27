// @flow
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
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
import nodegit, { getLocalBranches, getRemoteBranches, getCurrentBranch } from '../utils/nodegit'

import * as LoadingActions from '../actions/loading'

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

class Branches extends Component {

  constructor(props) {
    super(props)

    this.state = {
      currentBranch: null,
      localBranches: {},
      remoteBranches: {},
    }
  }

  componentDidMount() {
    this.refresh()
  }

  refresh() {
    this.props.actions.loading.IncrementLoadingJobs()
    getLocalBranches(this.props.project.path)
      .then((branches) => {
        this.setState(Object.assign({}, this.state, {
          localBranches: this.makeTrees(branches),
        }))
      })
      .catch((error) => {
        console.error(error)
      })
      .then(() => {
        this.props.actions.loading.DecrementLoadingJobs()
      })

    this.props.actions.loading.IncrementLoadingJobs()
    getRemoteBranches(this.props.project.path)
      .then((branches) => {
        this.setState(Object.assign({}, this.state, {
          remoteBranches: this.makeTrees(branches),
        }))
      })
      .catch((error) => {
        console.error(error)
      })
      .then(() => {
        this.props.actions.loading.DecrementLoadingJobs()
      })

    this.props.actions.loading.IncrementLoadingJobs()
    getCurrentBranch(this.props.project.path)
      .then((branch) => {
        this.setState(Object.assign({}, this.state, {
          currentBranch: branch,
        }))
      })
      .catch((error) => {
        console.error(error)
      })
      .then(() => {
        this.props.actions.loading.DecrementLoadingJobs()
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
      const text = prefix + branch
      const style = {}
      if (isLocal && this.state.currentBranch && this.state.currentBranch.startsWith(text)) {
        style.fontWeight = 'bold'
      }
      return (
        <ListItem
          key={i}
          primaryText={text}
          leftIcon={<Icon
            color={groupColor}
          />}
          style={style}
          initiallyOpen={isLocal}
          primaryTogglesNestedList={nestedItems.length !== 0}
          onTouchTap={() => {
            this.checkout(`refs/${isLocal ? 'heads' : 'remotes'}/${text}`)
          }}
          nestedItems={nestedItems}
        />
      )
    })
  }

  checkout(branch) {
    alert(branch)
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


function mapStateToProps(state) {
  return {
    loading: state.loading,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loading: bindActionCreators(LoadingActions, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Branches)
