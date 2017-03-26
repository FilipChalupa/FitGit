// @flow
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import nodegit from '../utils/nodegit'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import * as LoadingActions from '../actions/loading'
import * as ProjectsActions from '../actions/projects'

class Commit extends Component {

  constructor(props) {
    super(props)

    this.state = {
      artifacts: [],
      refreshing: false,
      commitMessage: '',
      commiting: false,
    }

    this.repo = null
  }

  getArtifacts = () => {
    return this.state.artifacts.map((artifact, i) => {
      return (
        <RaisedButton
          key={artifact.path}
          label={artifact.path}
          fullWidth={true}
          primary={artifact.inIndex}
          onTouchTap={() => this.updateIndex(artifact)}
        />
      )
    })
  }

  updateIndex = (artifact) => {
    let index
    this.repo.refreshIndex()
      .then((idx) => {
        index = idx
        if (artifact.inIndex) {
          return index.removeByPath(artifact.path) // @TODO: This is not the usual unstage
        } else {
          return index.addByPath(artifact.path)
        }
      })
      .then(() => {
        return index.write()
      })
      .catch((e) => {
        console.error(e)
      })
      .then(() => {
        this.refresh() // @TODO: update only changed
      })
  }

  getStatusKeys = (status) => {
    const keys = []
    if (status.isNew()) { keys.push('new') }
    if (status.isModified()) { keys.push('modified') }
    if (status.isTypechange()) { keys.push('typechange') }
    if (status.isRenamed()) { keys.push('renamed') }
    if (status.isIgnored()) { keys.push('ignored') }

    return keys
  }

  getBody() {
    if (this.props.projects.active) {
      return (
        <div>
          <div style={{
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            <FlatButton
              icon={<RefreshIcon />}
              onTouchTap={this.refresh}
              disabled={this.state.refreshing}
            />
          </div>

          {this.getArtifacts()}

          <div
            style={{
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            <TextField
              hintText='Zpráva'
              multiLine={true}
              onChange={this.handleCommitMessageChange}
              value={this.state.commitMessage}
            />
            <RaisedButton
              label='Uložit'
              secondary={true}
              onTouchTap={this.commit}
              disabled={this.state.commiting}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          Musíte zvolit projekt.
        </div>
      )
    }

  }

  handleCommitMessageChange = (e, commitMessage) => {
    this.setCommitMesage(commitMessage)
  }

  setCommitMesage = (commitMessage) => {
    this.setState(Object.assign({}, this.state, {
      commitMessage,
    }))
  }

  commit = () => {
    this.setCommiting(true)
    let oid
    const author = nodegit.Signature.create('Scott Chacon', 'schacon@gmail.com', Math.floor(Date.now() / 1000), (new Date).getTimezoneOffset()) // @TODO: Get real author
    this.repo.refreshIndex()
      .then((index) => {
        return index.writeTree()
      })
      .then((oidResult) => {
        oid = oidResult
        return nodegit.Reference.nameToId(this.repo, 'HEAD')
      })
      .then((head) => {
        return this.repo.getCommit(head)
      })
      .then((parent) => {
        return this.repo.createCommit('HEAD', author, author, this.state.commitMessage, oid, [parent])
      })
      .then(() => {
        this.setCommitMesage('')
        this.refresh()
      })
      .catch((e) => {
        console.error(e)
      })
      .then(() => {
        this.setCommiting(false)
      })
  }

  setRefreshing = (refreshing) => {
    this.setState(Object.assign({}, this.state, { refreshing }))
    if (refreshing) {
      this.props.actions.loading.IncrementLoadingJobs()
    } else {
      this.props.actions.loading.DecrementLoadingJobs()
    }
  }

  setCommiting = (commiting) => {
    this.setState(Object.assign({}, this.state, { commiting }))
    if (refreshing) {
      this.props.actions.loading.IncrementLoadingJobs()
    } else {
      this.props.actions.loading.DecrementLoadingJobs()
    }
  }

  componentDidMount() {
		this.refresh()
	}

  refresh = () => {
    this.setRefreshing(true)
    nodegit.Repository.open(this.props.projects.active.path)
      .then((repo) => {
        this.repo = repo
        return repo.getStatus()
      })
      .then((artifacts) => {
        this.setState(Object.assign({}, this.state, {
          artifacts: artifacts.map((artifact) => {
            return {
              inIndex: !!artifact.inIndex(),
              path: artifact.path(),
            }
          }),
        }))
      })
      .catch((e) => {
        console.error(e)
      })
      .then(() => {
        this.setRefreshing(false)
      })
  }

  render() {
    return (
      <div>
        <h1>Commit</h1>
        {this.getBody()}
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
      loading: bindActionCreators(LoadingActions, dispatch),
      projects: bindActionCreators(ProjectsActions, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Commit)
