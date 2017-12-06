/* global describe beforeEach it */

import { expect } from 'chai'
import React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import WeatherItem from './WeatherItem'

const adapter = new Adapter()
enzyme.configure({ adapter })

describe('WeatherItem', () => {
  let weatherItem
  let todayForcast = {
    icon: 'cloudy',
    summary: 'cloud day',
    apparentTemperatureHigh: 60,
    apparentTemperatureLow: 40
  }

  beforeEach(() => {
    weatherItem = shallow(<WeatherItem forecast={todayForcast} />)
  })

  it('Loads the summary in an h3', () => {
    expect(weatherItem.find('h3').text()).to.be.equal('cloud day')
  })

  it('Loads the correct high apparent temperature', () => {
    expect(weatherItem.find('#high').text()).to.be.equal('High: 60° F')
  })

  it('Loads the correct low apparent temperature', () => {
    expect(weatherItem.find('#low').text()).to.be.equal('Low: 40° F')
  })

})
