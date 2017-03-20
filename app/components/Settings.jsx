// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import * as SettingsActions from '../actions/settings'

class Settings extends Component {

  getItems = () => {
    const items = {
      cs: 'Česky',
      en: 'English',
      de: 'Deutsch',
    }
    return Object.keys(items).map((key) => {
      return (
        <MenuItem
          key={key}
          value={key}
          primaryText={items[key]}
        />
      )
    })
  }

  handleChange(e, i, language) {
    this.props.setLanguage(language)
  }

  render() {
    return (
      <div>
        <h1>{this.props.settings.texts.menu_settings}</h1>
        <SelectField
          floatingLabelText={this.props.settings.texts.settings_language}
          value={this.props.settings.language}
          onChange={this.handleChange.bind(this)}
        >
          {this.getItems()}
        </SelectField>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    settings: state.settings,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
