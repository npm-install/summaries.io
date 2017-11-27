import React, { Component } from 'react'
import Article from './Article'
import Paper from 'material-ui/Paper'
import { NYT, IGN, TechCrunch } from './DumbyData'
import { db, firebaseAuth } from '../config/constants'

function today() {
  const dt = new Date()
  return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + (dt.getDate() - 1)
}


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

    const currentUser = firebaseAuth().currentUser // will be used when we have emails as user ids

    console.log(today())
    db
      .collection('users')
      .doc('5CmbNogIFYyCBcWTVrrS')
      .collection('emails')
      .doc(today())
      .collection('bloomberg')
      .get()
      .then(snapshot => {
        const artFromSource = []
        snapshot.forEach(doc => {
          artFromSource.push(doc.data())
        })
        this.setState({
          articles: {
            bloomberg: artFromSource
          }
        })
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })

    // this.setState({ articles: articles })
  }

  render() {
    console.log(this.state.articles)
    console.log(Object.keys(this.state.articles))
    return (
      <div className="source-summary">

        {this.state.articles.bloomberg &&
          Object.keys(this.state.articles).map(key => (
            <div key={key} className="each-source">
              <div className="source-header">
                <img
                  src={this.state.articles[key][0].source.logo}
                  className="sourcelogo"
                  alt="logo"
                />
                <h3 className="source-title">{this.state.articles[key][0].source.name}</h3>
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
