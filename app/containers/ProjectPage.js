// @flow
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Project from '../components/Project'
import * as ProjectsActions from '../actions/projects'

function mapStateToProps(state) {
  return {
    projects: state.projects
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProjectsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Project)
