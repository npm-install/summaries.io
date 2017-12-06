import { expect } from 'chai'
import React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Article from './Article'

const adapter = new Adapter()
enzyme.configure({ adapter })

describe('Article', () => {
  let newArticle
  let exampleArticle = {
    url:
      'http://www.bloomberg.com/news/articles/2017-12-06/gop-conservatives-raising-spending-warning-after-tax-bill-costs',
    title: 'GOP Conservatives Raising Spending Warning After Tax Bill Costs',
    summary:
      'A faction of conservative Republicans is raising warnings about federal spending, two weeks after backing tax-cut legislation that would raise federal deficits by $1 trillion over the next decade.'
  }

  beforeEach(() => {
    newArticle = shallow(<Article article={exampleArticle} />)
  })

  it('renders article link', () => {
    expect(newArticle.find('a').length).to.equal(1)
  })

  it('renders article summary', () => {
    expect(newArticle.find('li').length).to.equal(1)
  })

  it('renders the correct content', () => {
    expect(
      newArticle.find('div').contains(<li className="summary-text">{exampleArticle.summary}</li>)
    ).to.equal(true)
    expect(
      newArticle.find('div').contains(
        <a href={exampleArticle.url} className="article-link">
          {exampleArticle.title}
        </a>
      )
    ).to.equal(true)
  })
})
