import React from 'react'
import ReactAnimatedWeather from 'react-animated-weather'

const WeatherItem = ({ forecast }) => {

  return (
    <div id="weather">
      <div id="weather_img">
        <ReactAnimatedWeather
          icon={forecast.icon.toUpperCase().split('-').join('_')}
          color={'#FFA14A'}
          size={128}
          animate={true}
        />
      </div>
      <div id="weather_info">
        <h3>{forecast.summary}</h3>
        <h4>High: {Math.round(forecast.apparentTemperatureHigh)}° F</h4>
        <h4>Low: {Math.round(forecast.apparentTemperatureLow)}° F</h4>
      </div>
    </div>
  )
}

export default WeatherItem
