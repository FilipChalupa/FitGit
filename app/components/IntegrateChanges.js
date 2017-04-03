// @flow
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import nodegit from '../utils/nodegit'
import * as LoadingActions from '../actions/loading'

class IntegrateChanges extends Component {


  done() {
    console.log('done')
  }

  accept = () => {
    let repo
    let localTree
    let remoteTree
    let patches
    let currentPathIndex
    let hunks
    let currentHunkIndex

    const processPatch = () => {
      console.log('process')
      if (patches.length === currentPathIndex) {
        console.log('done')
        return Promise.resolve()
      }

      return patches[currentPathIndex++].hunks()
        .then((h) => {
          hunks = h
          currentHunkIndex = 0
          processHunk()
        })
        .then(processPatch)
    }

    const processHunk = () => {
      if (hunks.length === currentHunkIndex) {
        console.log('hunks done')
        return Promise.resolve()
      }

      console.log('Hunk')
      console.log(hunks[currentHunkIndex].header())
      return hunks[currentHunkIndex++].lines()
        .then((lines) => {
          lines.forEach((line) => {
            console.log(line.content())
          })
          console.log('')
        })
        .then(processHunk)
    }

    this.props.actions.loading.IncrementLoadingJobs()
    nodegit.Repository.open(this.props.projects.active.path)
      .then((r) => {
        repo = r
        return repo.getBranchCommit('master') // @TODO: get main branch
      })
      .then((commit) => commit.getTree())
      .then((tree) => {
        localTree = tree
        return repo.getBranchCommit('origin/master')
      })
      .then((commit) => commit.getTree())
      .then((tree) => {
        remoteTree = tree
        return localTree.diff(remoteTree)
      })
      .then((diffs) => diffs.patches())
      .then((p) => {
        patches = p
        currentPathIndex = 0
        return processPatch()
      })
      .catch((error) => {
        console.log('ups')
        console.error(error)
      })
      .then(() => {
        console.log('mega done')
        this.props.actions.loading.DecrementLoadingJobs()
      })
  }

  render() {
    return (
      <div>
        <h1>Začlenit změny</h1>
        <RaisedButton
          label='Přijmout změny'
          secondary={true}
          onTouchTap={this.accept}
        />
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    loading: state.loading,
    projects: state.projects,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loading: bindActionCreators(LoadingActions, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IntegrateChanges)
