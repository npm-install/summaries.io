import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import ReactLoading from 'react-loading';
import zipcodes from 'zipcodes'
import WeatherItem from './WeatherItem'
import { db } from '../config/constants'


export default class WeatherWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zipCode: '08536',
      weather: {},
      location: {}
    };
  }

  componentDidMount() {
    const date = dateMaker()
    const zipCode = this.state.zipCode;

    db
      .collection('weather')
      .doc('days')
      .collection(date)
      .doc('zip')
      .collection(zipCode)
      .get()
      .then(snapshot => {
        let weatherForecast = []

        snapshot.forEach(doc => {
          weatherForecast.push(doc.data())
        })
        weatherForecast = weatherForecast[0];

        this.setState({
          weather: weatherForecast,
          location: zipcodes.lookup(zipCode)
        })
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
  }

  render() {

    if (Object.keys(this.state.weather).length === 0) {
      return (
        <Paper zDepth={2} className="article-card">
          <div className="loading-weather">
            <ReactLoading type="spinningBubbles" color="#444" />
          </div>
        </Paper>
      )
    }
    const weather = this.state.weather
    const location = this.state.location
    console.log(weather)
    return (
      <div>
        <Paper zDepth={2} className="article-card">
          <div className="weather-widget">
            <h3>Weather for {`${location.city}, ${location.state}`}</h3>
            <h5>{weather.summary}</h5>
            <div>
              <WeatherItem forecast={weather.data[0]} />
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

function dateMaker() {
  const date = new Date()
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}
