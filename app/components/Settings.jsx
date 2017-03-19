// @flow
import React, { Component } from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

export default class Settings extends Component {

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

  render() {
    return (
      <div>
        <h1>Nastavení</h1>
        <SelectField
          floatingLabelText='Jazyk'
          value='cs'
          onChange={this.handleChange}
        >
          {this.getItems()}
        </SelectField>
      </div>
    );
  }
}
