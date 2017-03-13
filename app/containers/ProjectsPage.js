// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Projects from '../components/Projects';
import * as ActiveProjectActions from '../actions/activeProject';

function mapStateToProps(state) {
  return {
    activeProject: state.activeProject
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActiveProjectActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
