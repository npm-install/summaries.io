import React, { Component } from 'react'
import Article from './Article'
import Paper from 'material-ui/Paper'
import { db, firebaseAuth } from '../config/constants'

function today() {
  const dt = new Date()
  return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
}

export default class SourceSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: {},
    }
  }

  componentDidMount() {
    db
      .collection('users')
      .doc(firebaseAuth().currentUser.email)
      .collection('emails')
      .doc(today())
      .collection('reuters')
      .get()
      .then(snapshot => {
        const artFromSource = []
        snapshot.forEach(doc => {
          artFromSource.push(doc.data())
        })
        this.setState({
          articles: {
            reuters: artFromSource,
          },
        })
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })


  }

  render() {
    return (
      <div className="source-summary">
        {this.state.articles.reuters &&
          Object.keys(this.state.articles).map(key => (
            <div key={key} className="each-source">
              <div className="source-header">
                <h3 className="source-title">{this.state.articles[key][0].source.name}</h3>
              </div>

              <div className="source-content">
                {this.state.articles[key].map(article => (
                  <Paper zDepth={2} key={article.title} className="article-card">
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
