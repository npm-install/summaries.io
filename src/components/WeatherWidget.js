import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import ReactLoading from 'react-loading';
import zipcodes from 'zipcodes'
import DarkSkyApi from 'dark-sky-api';
// import Skycons from 'react-skycons'
// const { weatherKey } = require('../functions/keys.js');
import ReactAnimatedWeather from 'react-animated-weather';

export default class WeatherWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zipCode: '',
      weatherJSON: {},
      forecastWeather: {},
      city: ''
    };

    this.submitHandler = this.submitHandler.bind(this)
  }


  getCurrentData(position, location) {
    const weatherKey = '3802941ad5b8c716614249ea1cf918b8'

    DarkSkyApi.apiKey = weatherKey


    DarkSkyApi.loadCurrent(position)
      .then(result => {
        this.setState(
          {
            weatherJSON: result,
            city: `${location.city}, ${location.state}`
          }
        )
      })
      .catch(console.error)
  }

  submitHandler(event) {
    event.preventDefault()
    let zip = event.target.zip.value

    while (zip.length < 5) zip = '0' + zip

    const location = zipcodes.lookup(zip)
    if (!location) {
      alert('Invalid Zipcode, try again')
      return false
    }

    const position = {
      latitude: location.latitude,
      longitude: location.longitude
    };

    this.setState({ zipCode: zip, weatherJSON: {} })
    this.getCurrentData(position, location)


  }

  render() {

    // console.log(this.state)

    if (!this.state.zipCode) {
      return (
        <div>
          <Paper zDepth={2} className="article-card">
            <div className="zipcode-input">
              <h3>Enter your zip code to get weather!</h3>
              <form onSubmit={this.submitHandler}>
                <label htmlFor="zip">Zip Code:</label>
                <input
                  name="zip"
                  placeholder="10001"
                  type="number"
                  step="1"
                  min="00000"
                  max="99999"
                />
                <button type="submit" className="btn btn-primary">
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
    const weather = this.state.weatherJSON;

    console.log(weather)
    return (
      <div>
        <Paper zDepth={2} className="article-card">
          <div className="weather-widget">
            <h3>Weather for {this.state.city}</h3>
            <div>
              <h4>{weather.summary}</h4>
              <h5>{Math.round(weather.temperature)}° F</h5>
              <ReactAnimatedWeather
                icon={weather.icon.toUpperCase().split('-').join('_')}
                color={'#FFA14A'}
                size={128}
                animate={true}
              />
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}
