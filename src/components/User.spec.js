/* global describe beforeEach it */

import { expect } from 'chai'
import React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { User } from './User'

const adapter = new Adapter()
enzyme.configure({ adapter })
describe('User Component', () => {
  let user

  beforeEach(() => {
    user = shallow(<User user={{ email: 'cody@email.com' }} />)
  })

  it('renders the email in an h2', () => {
    expect(user.find('h2').text()).to.be.equal('Welcome, cody@email.com')
  })
})
