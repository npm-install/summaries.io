import React, { Component } from 'react'
import Article from './Article'
import Paper from 'material-ui/Paper'
import { NYT, IGN, TechCrunch } from './DumbyData'

export default class SourceSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: {}
    }
  }

  componentDidMount() {
    const articles = {
      newyorktimes: NYT,
      ignnews: IGN,
      tc: TechCrunch
    }
    this.setState({ articles: articles })
  }

  render() {
    console.log(this.state.articles)
    return (
      <div className="source-summary">
        {this.state.articles.newyorktimes &&
          Object.keys(this.state.articles).map(key => (
            <div key={key} className="each-source">
              <div className="source-header">
                <img
                  src={this.state.articles[key][0].source.logo}
                  className="sourcelogo"
                  alt="logo"
                />
                <h3 className="source-title">
                  {this.state.articles[key][0].source.name}
                </h3>
              </div>

              <div className="source-content">
                {this.state.articles[key].map(article => (
                  <Paper
                    zDepth={2}
                    key={article.title}
                    className="article-card"
                  >
                    <div className="each-article">
                      <Article article={article} />
                    </div>
                  </Paper>
                ))}
              </div>
            </div>
          ))}
      </div>
    )
  }
}
