import { expect } from 'chai'
import React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import User from './User'

const adapter = new Adapter()
enzyme.configure({ adapter })

describe('User', () => {
  let userComponent
  let exampleUser = {
    email: 'test@user.com'
  }

  beforeEach(() => {
    userComponent = shallow(<User user={exampleUser} />)
  })

  it('renders one user input, for the email', () => {
    expect(userComponent.find('TextField').length).to.equal(1)
  })

  it('renders two selects', () => {
    expect(userComponent.find('SelectField').length).to.equal(2)
  })

  it('renders the correct greeting message', () => {
    expect(
      userComponent
        .find('div')
        .contains(<h2 className="welcome-message">Welcome, {exampleUser.email}</h2>)
    ).to.equal(true)
  })

  it('renders the correct podcast link', () => {
    expect(
      userComponent
        .find('TextField').props().defaultValue
    ).to.equal('https://summaries.io/podcast/' + exampleUser.email)
  })
})
