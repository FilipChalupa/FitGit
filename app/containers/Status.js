// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Snackbar from 'material-ui/Snackbar'

import * as StatusActions from '../actions/status'

class Status extends Component {

  constructor(props) {
    super(props)

    this.counter = 0
  }

  componentWillUnMount() {
    clearTimeout(this.timer)
  }

  handleRequestClose = () => {
    this.props.actions.status.closeStatus()
  }

  render() {
    return (
      <Snackbar
        open={this.props.status.open}
        message={this.props.status.message}
        action={this.props.status.buttonText}
        onActionTouchTap={this.props.status.buttonCallback}
        onRequestClose={this.handleRequestClose}
      />
    )
  }
}


function mapStateToProps(state) {
  return {
    status: state.status,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      status: bindActionCreators(StatusActions, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Status)
