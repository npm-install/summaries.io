import React from 'react'
import ReactAnimatedWeather from 'react-animated-weather'

const WeatherItem = ({ forecast }) => {
  console.log(forecast)
  console.log(new Date(+forecast.time))
  return (
    <div>
      <ReactAnimatedWeather
        icon={'CLEAR_DAY'}
        color={'#FFA14A'}
        size={64}
        animate={true}
      />
      <h5>{forecast.summary}</h5>
      <h6>{Math.round(forecast.apparentTemperature)}° F</h6>
    </div>
  )
}

export default WeatherItem
