import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import ReactLoading from 'react-loading'
import { setTimeout } from 'core-js/library/web/timers'
import zipcodes from 'zipcodes'
import DarkSkyApi from 'dark-sky-api'
// import Skycons from 'react-skycons'
// const { weatherKey } = require('../functions/keys.js');
let count = 1

export default class WeatherWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zipCode: '',
      weatherJSON: {},
      city: '',
    }

    this.submitHandler = this.submitHandler.bind(this)
  }

  getData(zip) {
    const weatherKey = '3802941ad5b8c716614249ea1cf918b8'

    DarkSkyApi.apiKey = weatherKey

    const location = zipcodes.lookup(zip)

    const position = {
      latitude: location.latitude,
      longitude: location.longitude,
    }

    DarkSkyApi.loadCurrent(position)
      .then(result => {
        this.setState({
          weatherJSON: result,
          city: location.city,
        })
      })
      .catch(console.error)
  }

  submitHandler(event) {
    event.preventDefault()
    let zip = event.target.zip.value

    while (zip.length < 5) zip = '0' + zip

    this.setState({ zipCode: zip, weatherJSON: {} })

    setTimeout(() => {
      this.getData(zip)
    }, 2000)
  }

  render() {
    console.log('Component rendered', count++, 'time(s)')
    console.log(this.state)
    // if (count === 2) this.getData()

    if (!this.state.zipCode) {
      return (
        <div>
          <Paper zDepth={2} className="article-card">
            <div className="zipcode-input">
              <h3>Enter your zip code to get weather!</h3>
              <form onSubmit={this.submitHandler}>
                <label htmlFor="zip" style={{marginRight: '1em'}}>Zip Code:</label>
                <input
                  name="zip"
                  placeholder="10001"
                  type="number"
                  step="1"
                  min="00000"
                  max="99999"
                />
                <button type="submit" className="btn btn-primary" style={{marginLeft: '1em'}}>
                  Submit
                </button>
              </form>
            </div>
          </Paper>
        </div>
      )
    } else if (Object.keys(this.state.weatherJSON).length === 0) {
      return (
        <Paper zDepth={2} className="article-card">
          <div className="loading-weather">
            <ReactLoading type="spinningBubbles" color="#444" />
          </div>
        </Paper>
      )
    }
    const weather = this.state.weatherJSON
    console.log(weather)
    return (
      <div>
        <Paper zDepth={2} className="article-card">
          <h1>Weather for {this.state.city}</h1>
          <div>
            <p>Temperature: {Math.floor(weather.temperature)} Degrees</p>
          </div>
        </Paper>
      </div>
    )
  }
}
