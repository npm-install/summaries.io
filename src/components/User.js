import React from 'react'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import { RaisedButton } from 'material-ui'

export default function User(props) {
  const email = props.user.email
  return (
    <div className="user-container">
      <div>
        <Paper circle={true} zDepth={2} />
      </div>
      <span>
        <div>
          <TextField hintText={`First Name`} />
        </div>
        <div>
          <TextField hintText={`Last Name`} />
        </div>
        <div>
          <TextField hintText={`Email Address`} defaultValue={email} />
        </div>
        <RaisedButton
          label="Save"
          primary={true}
          type="submit"
        />
        <div>{JSON.stringify(props.user)}</div>
      </span>
    </div>
  )
}
