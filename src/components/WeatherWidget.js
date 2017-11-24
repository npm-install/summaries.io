import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import axios from 'axios';
// const { weatherKey } = require('../functions/keys.js');

export default class WeatherWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCode: '',
      weatherJSON: {}
    };

    this.submitHandler = this.submitHandler.bind(this)
  }

  componentDidMount() {
    const weatherKey = '56f2b6fcede722ad8a463396763c6270'
    // console.log(weatherKey)

    if (this.state.zipCode) {
      axios
        .get(
        `http://api.openweathermap.org/data/2.5/weather?zip=${
        this.state.zipCode
        },us&appid=${weatherKey}`
        )
        .then(res => {
          console.log(res.data)
          // this.setState({ weatherJSON: res.data });
        })
        .catch(console.error)
    }
  }

  submitHandler(event) {
    event.preventDefault()
    let zip = event.target.zip.value;

    while (zip.length < 5) zip = '0' + zip;

    this.setState({ zipCode: zip })
  }

  render() {
    console.log(this.state.zipCode)

    if (!this.state.zipCode) {
      return (
        <div>
          <Paper zDepth={2} className="article-card">
            <div className="zipcode-input">
              <h3>Enter your zip code to get weather!</h3>
              <form onSubmit={this.submitHandler}>
                <label htmlFor="zip">Zip Code:</label>
                <input name="zip" placeholder="10001" type="number" step="1" min="00000" max="99999" />
                <button type="submit" className="btn btn-primary">
                  Submit
              </button>
              </form>
            </div>
          </Paper>
        </div>
      );
    }
    else if (Object.keys(this.state.weatherJSON).length === 0) {
      return (
        <Paper zDepth={2} className="article-card">
          <div className="zipcode-input">
            <div>Loading your weather</div>
          </div>
        </Paper>)
    }
    return (
      <div>
        <h1>Weather for {this.state.zipCode}</h1>
        <Paper zDepth={2} className="article-card">
          <div>
            <p>Heres ya weather fam</p>
          </div>
        </Paper>
      </div>
    );
  }
}
