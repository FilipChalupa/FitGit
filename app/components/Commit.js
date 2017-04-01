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
import * as StatusActions from '../actions/status'
import styles from './Commit.css';

class Commit extends Component {

  constructor(props) {
    super(props)

    this.state = {
      artifacts: [],
      refreshing: false,
      commitMessage: '',
      commiting: false,
      nothingSelected: true,
    }

    this.repo = null
  }

  getArtifacts = () => {
    return this.state.artifacts.map((artifact, i) => {
      return (
        <div
          className={styles.wrapper}
          key={artifact.path}
        >
          <button
            className={`${styles.in} ${artifact.inIndex && styles.full}`}
            onTouchTap={() => this.updateIndex(artifact)}
          >
            <span className={styles.selected}></span>
            {artifact.path}
          </button>
        </div>
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

  renderArtifacts() {
    const artifacts = this.getArtifacts()
    if (artifacts.length === 0) {
      return (
        <div
          style={{
            textAlign: 'center',
          }}
        >
          Aktuálně nejsou v projektu žádné necommitované změny.
        </div>
      )
    }
    return artifacts
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

          {this.renderArtifacts()}

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
              disabled={this.state.commiting || this.state.nothingSelected}
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
        const author = this.repo.defaultSignature()
        return this.repo.createCommit('HEAD', author, author, this.state.commitMessage, oid, [parent])
      })
      .then(() => {
        this.setCommitMesage('')
        this.refresh()
        this.props.actions.status.addStatus('Commit byl vytvořen')
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
    if (this.refreshing) {
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
        let nothingSelected = true
        this.setState(Object.assign({}, this.state, {
          artifacts: artifacts.map((artifact) => {
            if (artifact.inIndex()) {
              nothingSelected = false
            }
            return {
              inIndex: !!artifact.inIndex(),
              path: artifact.path(),
            }
          }),
          nothingSelected: nothingSelected,
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
    loading: state.loading,
    projects: state.projects,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loading: bindActionCreators(LoadingActions, dispatch),
      projects: bindActionCreators(ProjectsActions, dispatch),
      status: bindActionCreators(StatusActions, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Commit)
