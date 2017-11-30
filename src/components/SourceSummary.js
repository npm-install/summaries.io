import React, { Component } from 'react'
import Article from './Article'
import Paper from 'material-ui/Paper'
import { db, firebaseAuth } from '../config/constants'
import { imageSources } from './SourceImgData'
import ReactLoading from 'react-loading';


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
    let sourceArr = []

    db
      .collection('users')
      .doc(firebaseAuth().currentUser.email)
      .collection('emails')
      .doc(today())
      .get()
      .then(doc => {
        let obj = doc.data()
        sourceArr = Object.keys(obj)
      })
      .then(() => {
        const promises = sourceArr.map(async source => {
          const articles = await db
            .collection('users')
            .doc(firebaseAuth().currentUser.email)
            .collection('emails')
            .doc(today())
            .collection(source)
            .get()
            .then(snapshot => {
              const artFromSource = []
              snapshot.forEach(doc => {
                artFromSource.push(doc.data())
              })
              return artFromSource
            })

          return { [source]: articles }
        })

        return Promise.all(promises).then(articleObjects => Object.assign({}, ...articleObjects))
      })
      .then(arr => {
        this.setState({ articles: arr });
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
  }

  render() {

    console.log('state', this.state.articles)
    if (Object.keys(this.state.articles).length === 0) {
      return (
        <div>
          <h3>Come back tomorrow for your daily summaries</h3>
          <div id="new_user_load">
            <h4>We are working hard to generate them</h4>
            <div id="user_img_load">
            <ReactLoading type="bubbles" color="#ffa14a" height="25" width="25" />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="source-summary">
        <h2 className="welcome-title">Here is your summary for today: </h2>
        {Object.keys(this.state.articles).map(key => (
          <div key={key} className="each-source">
            <div className="source-header">
              <img src={imageSources[this.state.articles[key][0].source.id]} alt="" className="source-image" />
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
