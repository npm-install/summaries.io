import React from 'react'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block'
}

export default function User() {
  return (
    <div className="user-container">
      <div>
        <Paper style={style} circle={true} zDepth={2} />
      </div>
      <span>
        <TextField hintText={`First Name`} />
        <Divider />
        <TextField hintText={`Last Name`} />
        <Divider />
        <TextField hintText={`Email Address`} />
      </span>
    </div>
  )
}
