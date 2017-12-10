import React, { Component } from 'react'
import Paper from 'material-ui/Paper';
import DarkSkyApi from 'dark-sky-api';
import zipcodes from 'zipcodes'
import { db, firebaseAuth } from '../config/constants'
import { weatherKey } from '../keys'


class ZipCode extends Component {

  constructor(props) {
    super(props)
    this.submitHandler = this.submitHandler.bind(this)
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

        // write zipcode to current user

        // Get current users
        const userEmail = firebaseAuth().currentUser.providerData[0].email;

        // Check to see if the user has an email
        db
          .collection('users')
          .doc(userEmail)
          .set({ zip }, { merge: true })
          .then(() => {
            const weather = {
              apparentTemperatureHigh: weatherToday.apparentTemperatureHigh,
              apparentTemperatureLow: weatherToday.apparentTemperatureLow,
              icon: weatherToday.icon,
              summary: weatherToday.summary
            }
            // save weather for this zipcode
            db
              .collection('weather')
              .doc('days')
              .collection(dateMaker())
              .doc('zip')
              .collection(zip)
              .doc('forecast')
              .set(weather)
              .then(() => {
                this.props.stateSetter({
                  weather,
                  location,
                  changeZip: false
                })
              })
              .catch(console.error)
          })
          .catch(console.error)
      })
      .catch(console.error);

  }

  render() {
    return (
      <div>
        <Paper zDepth={2} className="article-card">
          <div className="zipcode-input">
            <h3>Enter your zip code to get weather!</h3>
            <form onSubmit={this.submitHandler} className="form-zip">
              <label htmlFor="zip">Zip Code:</label>
              <input id="zip-input" name="zip" placeholder="10001" type="number" step="1" min="00000" max="99999" />
              <button type="submit" id="weather-btn" className="btn btn-primary">
                Submit</button>
            </form>
          </div>
        </Paper>
      </div>
    )
  }
}

export default ZipCode

function dateMaker() {
  const date = new Date()
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}
