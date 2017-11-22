import React from 'react'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import { RaisedButton } from 'material-ui'

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block'
}

export default function User(props) {
  const email = props.user.email
  return (
    <div className="user-container">
      <div>
        <Paper style={style} circle={true} zDepth={2} />
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
          style={style.raisedBtn}
          type="submit"
        />
        <div>{JSON.stringify(props.user)}</div>
      </span>
    </div>
  )
}
