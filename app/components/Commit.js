// @flow
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import SelectAllIcon from 'material-ui/svg-icons/content/select-all'
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
      updating: false,
      commitMessage: '',
      commiting: false,
      nothingSelected: true,
      allSelected: false,
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
    this.setUpdating(true)
    this.repo.index()
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
        this.setUpdating(false)
        this.refresh() // @TODO: update only changed
      })
  }

  selectAll = () => {
    console.log('select all')
    this.forAll((index) => {
      return index.addAll()
    })
  }

  unselectAll = () => {
    console.log('unselect all')
    this.forAll((index) => {
      return index.removeAll() // @TODO: handle staged as deleted
    })
  }

  forAll = (action) => {
    console.log('go')
    let index
    this.setUpdating(true)
    this.repo.index()
      .then((idx) => {
        index = idx
        console.log('my action')
        return action(index)
      })
      .then(() => {
        console.log('write')
        return index.write()
      })
      .catch((e) => {
        console.log('ups')
        console.error(e)
      })
      .then(() => {
        console.log('done')
        this.setUpdating(false)
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
              icon={<SelectAllIcon />}
              onTouchTap={this.state.allSelected ? this.unselectAll : this.selectAll}
              disabled={this.state.refreshing || this.state.updating}
            />
            <FlatButton
              icon={<RefreshIcon />}
              onTouchTap={this.refresh}
              disabled={this.state.refreshing || this.state.updating}
            />
          </div>

          <div
            style={{
              opacity: (this.state.refreshing || this.state.updating) ? 0.5 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            {this.renderArtifacts()}
          </div>

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

  setRefreshing = (refreshing: boolean) => {
    this.setState(Object.assign({}, this.state, { refreshing }))
    if (refreshing) {
      this.props.actions.loading.IncrementLoadingJobs()
    } else {
      this.props.actions.loading.DecrementLoadingJobs()
    }
  }

  setCommiting = (commiting: boolean) => {
    this.setState(Object.assign({}, this.state, { commiting }))
    if (commiting) {
      this.props.actions.loading.IncrementLoadingJobs()
    } else {
      this.props.actions.loading.DecrementLoadingJobs()
    }
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
    this.setRefreshing(true)
    nodegit.Repository.open(this.props.projects.active.path)
      .then((repo) => {
        this.repo = repo
        return repo.getStatus()
      })
      .then((artifacts) => {
        const countAll = artifacts.length
        let countSelected = 0
        this.setState(Object.assign({}, this.state, {
          artifacts: artifacts.map((artifact) => {
            if (artifact.inIndex()) {
              countSelected++
            }
            return {
              inIndex: !!artifact.inIndex(),
              path: artifact.path(),
            }
          }),
          nothingSelected: countSelected === 0,
          allSelected: countSelected === countAll,
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
