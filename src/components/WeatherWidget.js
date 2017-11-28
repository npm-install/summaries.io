import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import ReactLoading from 'react-loading';
import zipcodes from 'zipcodes'
import WeatherItem from './WeatherItem'
import { db, firebaseAuth } from '../config/constants'
import { weatherKey } from '../keys'
import DarkSkyApi from 'dark-sky-api';


export default class WeatherWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zipCode: '',
      weather: {},
      location: {}
    };
    this.submitHandler = this.submitHandler.bind(this)
  }

  componentDidMount() {
    const date = dateMaker()
    const userEmail = firebaseAuth().currentUser.providerData[0].email;

    // Check to see if the user has an email
    const usersRef = db.collection('users')
    const userQuery = usersRef.where('email', '==', userEmail)
    let zipCode;

    // Get user info
    userQuery
      .get()
      .then(Users => {

        Users.forEach(user => {
          zipCode = user.data().zip
        })

        // If the user has a zipcode
        if (zipCode) {
          // Get weather data for the users zipcode from firebase
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
        } else {
          console.log('No zip code')
        }
      })
      .catch(err => {
        console.error('Error getting user info', err)
      })

  }

  submitHandler(event) {
    event.preventDefault()
    let zip = event.target.zip.value;

    while (zip.length < 5) zip = '0' + zip;

    const location = zipcodes.lookup(zip)

    if (!location) {
      alert('Invalid Zipcode, try again')
      return false
    }

    DarkSkyApi.apiKey = weatherKey;

    const position = {
      latitude: location.latitude,
      longitude: location.longitude
    };

    DarkSkyApi.loadForecast(position)
      .then(result => {
        const weatherToday = result.daily.data[0]
        this.setState({
          weather: weatherToday,
          location
        })
        console.log(weatherToday)
      })
      .catch(console.error);

  }

  render() {

    console.log(this.state)

    if (!Object.keys(this.state.location).length) {
      return (
        <div>
          <Paper zDepth={2} className="article-card">
            <div className="zipcode-input">
              <h3>Enter your zip code to get weather!</h3>
              <form onSubmit={this.submitHandler}>
                <label htmlFor="zip">Zip Code:</label>
                <input name="zip" placeholder="10001" type="number" step="1" min="00000" max="99999" />
                <button type="submit" id="weather-btn" className="btn btn-primary">
                  Submit
              </button>
              </form>
            </div>
          </Paper>
        </div>
      );
    }

    else if (Object.keys(this.state.weather).length === 0) {
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
    return (
      <div id="wea_widget">
        <Paper zDepth={2} className="article-card">
          <div className="weather-widget">
            <h3>Weather for today in {`${location.city}, ${location.state}`}</h3>
            <div>
              <WeatherItem forecast={weather} />
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
