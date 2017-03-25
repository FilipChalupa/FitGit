// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

import * as SettingsActions from '../actions/settings'

class Settings extends Component {

  constructor(props) {
    super(props)

    this.state = {
      confirmReset: false,
    }
  }

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

  openConfirmReset() {
    this.setState(Object.assign({}, this.state, { confirmReset: true }))
  }

  closeConfirmReset() {
    this.setState(Object.assign({}, this.state, { confirmReset: false }))
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

        <div>
          <RaisedButton
            label="Obnovit nastavení"
            secondary={true}
            onTouchTap={this.openConfirmReset.bind(this)}
          />
        </div>

        <Dialog
          title="Obnovit nastavení"
          actions={[
            <FlatButton
              label="Zrušit"
              primary={true}
              onTouchTap={this.closeConfirmReset.bind(this)}
            />,
            <FlatButton
              label="Potvrdit"
              primary={true}
              keyboardFocused={true}
              onTouchTap={() => {
                this.props.resetSettings()
                this.closeConfirmReset()
              }}
            />,
          ]}
          modal={false}
          open={this.state.confirmReset}
          onRequestClose={this.closeConfirmReset.bind(this)}
        >
          Opravdu chcete obnovit nastavení?
        </Dialog>
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
