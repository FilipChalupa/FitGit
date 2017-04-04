// @flow
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import nodegit from '../utils/nodegit'
import * as LoadingActions from '../actions/loading'

class IntegrateChanges extends Component {

  constructor(props) {
    super(props)

    this.state = {
      artifacts: [],
      updating: false,
    }

    this.repo = null
  }

  setUpdating = (updating: boolean) => {
    this.setState(Object.assign({}, this.state, { updating }))
    if (updating) {
      this.props.actions.loading.IncrementLoadingJobs()
    } else {
      this.props.actions.loading.DecrementLoadingJobs()
    }
  }

  componentDidMount() {
    this.refresh()
  }

  refresh = () => {
    let localTree
    let remoteTree
    let patches
    let currentPathIndex
    let hunks
    let currentHunkIndex
    let artifacts

    const processPatch = () => {
      if (patches.length === currentPathIndex) {
        return Promise.resolve()
      }
      const patch = patches[currentPathIndex++]

      artifacts[currentPathIndex] = {
        oldName: patch.oldFile().path(), // @TODO: check why oldName = newName always
        newName: patch.newFile().path(),
        hunks: [],
      }

      return patch.hunks()
        .then((h) => {
          hunks = h
          currentHunkIndex = 0
          return processHunk()
        })
        .then(processPatch)
    }

    const processHunk = () => {
      if (hunks.length === currentHunkIndex) {
        return Promise.resolve()
      }

      const hunk = hunks[currentHunkIndex++]

      return hunk.lines()
        .then((lines) => {
          artifacts[currentPathIndex].hunks.push(lines.map((line) => {
            return {
              origin: String.fromCharCode(line.origin()),
              content: line.content(),
            }
          }))
        })
        .then(processHunk)
    }

    this.setUpdating(true)
    artifacts = []
    nodegit.Repository.open(this.props.projects.active.path)
      .then((r) => {
        this.repo = r
        return this.repo.getBranchCommit('master') // @TODO: get main branch
      })
      .then((commit) => commit.getTree())
      .then((tree) => {
        localTree = tree
        return this.repo.getBranchCommit('origin/master')
      })
      .then((commit) => commit.getTree())
      .then((tree) => {
        remoteTree = tree
        return remoteTree.diff(localTree)
      })
      .then((diffs) => diffs.patches())
      .then((p) => {
        patches = p
        currentPathIndex = 0
        return processPatch()
      })
      .catch((error) => {
        console.error(error)
      })
      .then(() => {
        this.setState(Object.assign({}, this.states, { artifacts }))
        this.setUpdating(false)
      })
  }

  accept = () => {
    if (!this.repo) {
      return
    }
    this.setUpdating(true)
    const author = this.repo.defaultSignature()
    this.repo.mergeBranches('master', 'origin/master', author)
      .then((oid) => {
        console.log('merged!') // @TODO: let user know
      })
      .catch((error) => {
        alert('Došlo ke konfliktu')
        console.error(error)
      })
      .then(() => {
        this.setUpdating(false)
        this.refresh()
      })
  }

  getArtifacts() {
    return this.state.artifacts.map((artifact, i) => {
      const name = artifact.oldName + (artifact.oldName === artifact.newName ? '' : ` =&gt; ${artifact.newName}`)
      return (
        <div
          key={i}
          style={{
            marginTop: 10,
          }}
        >
          <h3
            style={{
              marginBottom: 5,
            }}
          >
            {name}
          </h3>
          {this.getHunks(artifact)}
        </div>
      )
    })
  }

  getBackgroundColor(origin: string) {
    switch (origin) {
      case '+':
        return 'rgba(0, 255, 0, 0.25)'
      case '-':
        return 'rgba(255, 0, 0, 0.25)'
      default:
        return 'rgba(0, 0, 0, 0.05)'
    }
  }

  getHunks(artifact) {
    return artifact.hunks.map((hunk, i) => {
      return (
        <div
          key={i}
          style={{
            paddingBottom: 5,
            marginBottom: 5,
            borderBottom: '1px solid gray',
          }}
        >
          {hunk.map((line, l) => {
            return (
              <pre
                key={l}
                style={{
                  backgroundColor: this.getBackgroundColor(line.origin),
                  margin: 0,
                  overflow: 'auto',
                }}
              >
                {line.origin}{line.content}
              </pre>
            )
          })}
        </div>
      )
    })
  }

  render() {

    const renderArtifacts = () => {
      const artifacts = this.getArtifacts()
      if (artifacts.length) {
        return artifacts
      } else {
        return (
          <div>
            Žádné změny nejsou k dispozici.
          </div>
        )
      }

    }

    return (
      <div>
        <div>
          <h1>Začlenit změny</h1>
          <RaisedButton
            label='Přijmout změny'
            secondary={true}
            onTouchTap={this.accept}
            disabled={this.state.updating}
          />
          <FlatButton
            icon={<RefreshIcon />}
            onTouchTap={this.refresh}
            disabled={this.state.updating}
          />
        </div>
        <div
          style={{
            marginTop: 20,
          }}
        >
          {renderArtifacts()}
        </div>
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
