import React from 'react'
import { RaisedButton } from 'material-ui'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/MenuItem'

export default function User(props) {
  const email = props.user.email

  return (
    <div>
      <h2 className="welcome-message">Welcome, {email}</h2>

      <div className="user-select">
        <RaisedButton label="Reset Password" secondary={true} className="user-select-btn" />
        <RaisedButton label="Delete Account" secondary={true} className="user-select-btn" />
        <SelectField floatingLabelText="Set Email Frequency" className="user-select-btn">
          <MenuItem value={1} primaryText="Never" />
          <MenuItem value={2} primaryText="Every Night" />
          <MenuItem value={3} primaryText="Weeknights" />
          <MenuItem value={4} primaryText="Weekends" />
          <MenuItem value={5} primaryText="Weekly" />
        </SelectField>
        <SelectField floatingLabelText="Set Email Sent Time" className="user-select-btn">
          <MenuItem value={1} primaryText="00:00" />
          <MenuItem value={2} primaryText="01:00" />
          <MenuItem value={3} primaryText="02:00" />
          <MenuItem value={4} primaryText="03:00" />
          <MenuItem value={5} primaryText="04:00" />
          <MenuItem value={5} primaryText="05:00" />
          <MenuItem value={5} primaryText="06:00" />
          <MenuItem value={5} primaryText="07:00" />
          <MenuItem value={5} primaryText="08:00" />
          <MenuItem value={5} primaryText="09:00" />
          <MenuItem value={5} primaryText="10:00" />
          <MenuItem value={5} primaryText="11:00" />
          <MenuItem value={5} primaryText="12:00" />
          <MenuItem value={5} primaryText="13:00" />
          <MenuItem value={5} primaryText="14:00" />
          <MenuItem value={5} primaryText="15:00" />
          <MenuItem value={5} primaryText="16:00" />
          <MenuItem value={5} primaryText="17:00" />
          <MenuItem value={5} primaryText="18:00" />
          <MenuItem value={5} primaryText="19:00" />
          <MenuItem value={5} primaryText="20:00" />
          <MenuItem value={5} primaryText="21:00" />
          <MenuItem value={5} primaryText="22:00" />
          <MenuItem value={5} primaryText="23:00" />
        </SelectField>
        <TextField
          floatingLabelText="Your podcast link"
          floatingLabelFixed={true}
          defaultValue={`https://summaries.io/podcast/${email}`}
        />
      </div>
    </div>
  )
}
