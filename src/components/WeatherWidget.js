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
  }

  componentDidMount() {
    const weatherKey = "56f2b6fcede722ad8a463396763c6270";
    console.log(weatherKey);
    axios
      .get(
      `http://api.openweathermap.org/data/2.5/weather?zip=${
      this.state.zipCode
      },us&appid=${weatherKey}`
      )
      .then(res => {
        this.setState({ weatherJSON: res.data });
      });
  }

  render() {
    console.log(this.state.weatherJSON);

    if (!this.state.zipCode) {
      return (
        <div>
          <h1>Enter your zip code to get weather!</h1>
          <Paper zDepth={2} className="article-card">
            <form>
              <label htmlFor="zip">Zip Code:</label>
              <input name="zip" placeholder="10001" />
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </Paper>
        </div>
      );
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
