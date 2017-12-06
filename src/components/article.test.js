import { expect } from 'chai'
import React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Article from './Article'

const adapter = new Adapter()
enzyme.configure({ adapter })

describe('Article', () => {
  let newArticle
  let exampleArticles = [
    {
      url:
        'http://www.bloomberg.com/news/articles/2017-12-06/gop-conservatives-raising-spending-warning-after-tax-bill-costs',
      title: 'GOP Conservatives Raising Spending Warning After Tax Bill Costs',
      summary:
        'A faction of conservative Republicans is raising warnings about federal spending, two weeks after backing tax-cut legislation that would raise federal deficits by $1 trillion over the next decade.'
    },
    {
      url:
        'https://techcrunch.com/gallery/these-are-the-10-best-tech-companies-to-work-for-in-the-u-s-according-to-glassdoor/',
      title: 'These are the 10 best tech companies to work for in the U.S., according to Glassdoor',
      summary:
        'Glassdoor just released its top 100  U.S.-based companies to work for next year. Since we cover technology over here at TechCrunch, we broke out the top 10..'
    }
  ]

  beforeEach(() => {
    newArticle = shallow(
      <Article
        article={exampleArticles}
      />
    )
  })

  it('renders 2 article links', () => {
    expect(newArticle.find('a').length).to.equal(2)
  })

  it('renders 2 article summaries', () => {
    expect(newArticle.find('li').length).to.equal(2)
  })

  it('renders the correct content', () => {
    expect(newArticle.find('a').at(1).contains('GOP Conservatives Raising Spending Warning After Tax Bill Costs')).to.equal(true)
  })

})
