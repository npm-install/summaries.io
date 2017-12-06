/* global describe beforeEach it */

import { expect } from 'chai'
import React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import User from './User'

const adapter = new Adapter()
enzyme.configure({ adapter })
describe('User Component', () => {
  let user

  beforeEach(() => {
    user = shallow(<User email={'cody@email.com'} />)
  })

  it('renders the email in an hw', () => {
    expect(user.find('hw').text()).to.be.equal('Welcome, cody@email.com')
  })
})
