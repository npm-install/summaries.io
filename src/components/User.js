import React, { Component } from 'react'
import { RaisedButton } from 'material-ui'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/MenuItem'
import DarkSkyApi from 'dark-sky-api';
import zipcodes from 'zipcodes'
import { db, firebaseAuth } from '../config/constants'
import { weatherKey } from '../keys'


export default class User extends Component {

  constructor(props) {
    super(props)
    this.submitHandler = this.submitHandler.bind(this)
  }

  submitHandler(event) {
    event.preventDefault()
    console.log('clicked')

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
                alert('Zip Code Successfully Changed to ' + zip)
              })
              .catch(console.error)
          })
          .catch(console.error)
      })
      .catch(console.error);

  }

  render() {
    const email = this.props.user.email

    return (
      <div>
        <h2 className="welcome-message">Welcome, {email}</h2>

        <div className="user-select">
          <RaisedButton label="Reset Password" secondary={true} className="user-select-btn" />
          <RaisedButton label="Delete Account" secondary={true} className="user-select-btn" />
          <SelectField floatingLabelText="Set Email Frequency" className="user-select-btn">
            <MenuItem value={1} primaryText="Never" />
            <MenuItem value={2} primaryText="Every Night" />
            <MenuItem value={3} primaryText="Weeknights" />
            <MenuItem value={4} primaryText="Weekends" />
            <MenuItem value={5} primaryText="Weekly" />
          </SelectField>
          <SelectField floatingLabelText="Set Email Sent Time" className="user-select-btn">
            <MenuItem value={1} primaryText="00:00" />
            <MenuItem value={2} primaryText="01:00" />
            <MenuItem value={3} primaryText="02:00" />
            <MenuItem value={4} primaryText="03:00" />
            <MenuItem value={5} primaryText="04:00" />
            <MenuItem value={5} primaryText="05:00" />
            <MenuItem value={5} primaryText="06:00" />
            <MenuItem value={5} primaryText="07:00" />
            <MenuItem value={5} primaryText="08:00" />
            <MenuItem value={5} primaryText="09:00" />
            <MenuItem value={5} primaryText="10:00" />
            <MenuItem value={5} primaryText="11:00" />
            <MenuItem value={5} primaryText="12:00" />
            <MenuItem value={5} primaryText="13:00" />
            <MenuItem value={5} primaryText="14:00" />
            <MenuItem value={5} primaryText="15:00" />
            <MenuItem value={5} primaryText="16:00" />
            <MenuItem value={5} primaryText="17:00" />
            <MenuItem value={5} primaryText="18:00" />
            <MenuItem value={5} primaryText="19:00" />
            <MenuItem value={5} primaryText="20:00" />
            <MenuItem value={5} primaryText="21:00" />
            <MenuItem value={5} primaryText="22:00" />
            <MenuItem value={5} primaryText="23:00" />
          </SelectField>
          <form onSubmit={this.submitHandler}>
            <label htmlFor="zip">Change Zip Code:</label>
            <input className="user-zip-btn" name="zip" placeholder="10001" type="number" step="1" min="00000" max="99999" />
            <button type="submit" id="weather-btn" className="btn">
              SUBMIT</button>
          </form>
          <TextField
            floatingLabelText="Your podcast link"
            floatingLabelFixed={true}
            defaultValue={`https://summaries.io/podcast/${email}`}
          />
        </div>
      </div>
    )
  }
}

function dateMaker() {
  const date = new Date()
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}
