// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import LinearProgress from 'material-ui/LinearProgress'

import * as LoadingActions from '../actions/loading'

class Loading extends Component {

  render() {
    return (
      <LinearProgress
        mode='indeterminate'
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
          opacity: Math.min(1, this.props.loading),
        }}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoadingActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading)
