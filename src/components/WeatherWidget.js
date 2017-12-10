import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import ReactLoading from 'react-loading';
import zipcodes from 'zipcodes'
import WeatherItem from './WeatherItem'
import { db, firebaseAuth } from '../config/constants'
import ZipCodeEnter from './ZipCodeEnter'


export default class WeatherWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zipCode: '',
      weather: {},
      location: {},
      changeZip: false
    };
    this.stateSetter = this.stateSetter.bind(this)
    this.changeZipClickHandler = this.changeZipClickHandler.bind(this)
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

              if (weatherForecast) {
                this.setState({
                  weather: weatherForecast,
                  location: zipcodes.lookup(zipCode)
                })
              }
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

  stateSetter(newStateProps) {
    this.setState(newStateProps)
  }

  changeZipClickHandler() {

    this.setState({changeZip: true})
  }

  render() {

    if (!Object.keys(this.state.location).length || this.state.changeZip) {
      return (
        <ZipCodeEnter stateSetter={this.stateSetter} />
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
            <div id="widget_header">
              <h3>Weather for today in {`${location.city}, ${location.state}`}</h3>
              <button id="zipButton" onClick={this.changeZipClickHandler}>Change Zip?</button>
            </div>
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
