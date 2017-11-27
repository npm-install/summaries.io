import React from 'react'
import ReactAnimatedWeather from 'react-animated-weather'

const WeatherItem = ({ forecast }) => {

  return (
    <div>
      <ReactAnimatedWeather
        icon={forecast.icon.toUpperCase().split('-').join('_')}
        color={'#FFA14A'}
        size={128}
        animate={true}
      />
      <h5>{forecast.summary}</h5>
      <h6>High: {Math.round(forecast.apparentTemperatureHigh)}° F</h6>
      <h6>Low: {Math.round(forecast.apparentTemperatureLow)}° F</h6>
    </div>
  )
}

export default WeatherItem
