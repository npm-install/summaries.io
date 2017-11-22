import React, { Component } from 'react'
import SourceSummary from './SourceSummary'

export default class Home extends Component {
  render() {
    return (
      <div>
      <h1 className="welcome">Welcome back!</h1>

      <h2 className="welcome-title">Here is your summary for today: </h2>

      <SourceSummary />

      </div>
    )
  }
}
