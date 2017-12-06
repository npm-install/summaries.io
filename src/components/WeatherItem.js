import React from 'react'
import ReactAnimatedWeather from 'react-animated-weather'

const WeatherItem = ({ forecast }) => {

  return (
    <div id="weather">
      <div id="weather_img">
        <ReactAnimatedWeather
          icon={forecast.icon.toUpperCase().split('-').join('_')}
          color={'#FFA14A'}
          size={100}
          animate={true}
        />
      </div>
      <div id="weather_info">
        <h3>{forecast.summary}</h3>
        <h5 id="high">High: {Math.round(forecast.apparentTemperatureHigh)}° F</h5>
        <h5 id="low" >Low: {Math.round(forecast.apparentTemperatureLow)}° F</h5>
      </div>
    </div>
  )
}

export default WeatherItem
