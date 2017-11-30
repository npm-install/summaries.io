import React, { Component } from 'react'
import { Step, Stepper, StepLabel } from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

export default class Landing extends Component {
  constructor() {
    super()
    this.state = {
      finished: false,
      stepIndex: 0,
    }
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.getStepContent = this.getStepContent.bind(this)
  }

  handleNext = () => {
    const { stepIndex } = this.state
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    })
  }

  handlePrev = () => {
    const { stepIndex } = this.state
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 })
    }
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return `Sign up with us or connect using your Gmail account`
      case 1:
        return 'Pick from our diverse selection of news sources and set gist receiving time'
      case 2:
        return 'Voilà! Enjoy your customzied daily gist'
      default:
        return "You're a long way from home sonny jim!"
    }
  }

  componentWillMount(){
    window.setInterval(this.handleNext, 3000)
    window.setInterval(() => this.setState({ stepIndex: 0, finished: false }), 12000)
  }


  render() {
    const { finished, stepIndex } = this.state
    const contentStyle = {
      margin: '0 16px',
      fontFamily: 'Noto Sans, sans-serif',
    }

    return (
      <div className="landing-page">
        <div className="landing-hero">
          <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" className="logo">
            <path
              className="right"
              fill="#EBF7F8"
              d="M354.462 130.937L236.308 62.721 196.923 85.46l118.154 68.216zM256 369.694l-78.769-45.478 39.384-22.739-39.384-22.738-78.769 45.477 118.153 68.216z"
            />
            <path
              className="right"
              fill="#4AB5C1"
              d="M295.385 392.432L256 415.171l39.385 22.739 39.384-22.739z"
            />
            <path
              className="top"
              fill="#4AB5C1"
              d="M196.923 85.46v113.693l39.385-22.739v-68.216z"
            />
            <path
              className="right"
              fill="#EBF7F8"
              d="M334.769 233.261l-98.461-56.847-39.385 22.739L295.385 256z"
            />
            <path
              className="right"
              fill="#4AB5C1"
              d="M334.769 324.216v-90.955L295.385 256v45.477L216.615 256l-39.384 22.739 118.154 68.216z"
            />
          </svg>
          <h1 className="hero-title">Summaries.io</h1>
          <h4 className="hero-description">Your news, your way</h4>
        </div>

        <div className="mobile-hero">
        <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" className="mobile-logo">
            <path
              className="right"
              fill="#EBF7F8"
              d="M354.462 130.937L236.308 62.721 196.923 85.46l118.154 68.216zM256 369.694l-78.769-45.478 39.384-22.739-39.384-22.738-78.769 45.477 118.153 68.216z"
            />
            <path
              className="right"
              fill="#4AB5C1"
              d="M295.385 392.432L256 415.171l39.385 22.739 39.384-22.739z"
            />
            <path
              className="top"
              fill="#4AB5C1"
              d="M196.923 85.46v113.693l39.385-22.739v-68.216z"
            />
            <path
              className="right"
              fill="#EBF7F8"
              d="M334.769 233.261l-98.461-56.847-39.385 22.739L295.385 256z"
            />
            <path
              className="right"
              fill="#4AB5C1"
              d="M334.769 324.216v-90.955L295.385 256v45.477L216.615 256l-39.384 22.739 118.154 68.216z"
            />
          </svg>
          <h1 className="hero-title">Summaries.io</h1>
          <h4 className="hero-description">Your news, your way</h4>
        </div>

        <div className="stepper">
          <Stepper activeStep={this.state.stepIndex}>
            <Step>
              <StepLabel
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontSize: '1.2em',
                }}
              >
                Sign Up with Email
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontSize: '1.2em',
                }}
              >
                Select and Customize Sources
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontSize: '1.2em',
                }}
              >
                Receive Your Daily Gist
              </StepLabel>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            {finished ? (
              <p>
                Voila!
                <button
                  onClick={event => {
                    event.preventDefault()
                    this.setState({ stepIndex: 0, finished: false })
                  }}
                  style={{ background: 'none', border: 'none' }}
                >
                  Click here
                </button>{' '}
                to go back to step one.
              </p>
            ) : (
              <div>
                <p style={{ marginTop: '2em', fontSize: '1.2em' }}>
                  {this.getStepContent(this.state.stepIndex)}
                </p>
                <div style={{ marginTop: '3em' }}>
                  <FlatButton
                    label="Back"
                    disabled={stepIndex === 0}
                    onClick={this.handlePrev}
                    style={{ marginRight: '1em' }}
                  />
                  <RaisedButton
                    label={stepIndex === 2 ? 'Finish' : 'Next'}
                    primary={true}
                    onClick={this.handleNext}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
