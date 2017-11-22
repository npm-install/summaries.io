import React, { Component } from 'react'
import { db } from '../../config/constants'
import Paper from 'material-ui/Paper'

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      // value: '',
      // message: '',
      // timestamp: '',
      sources: []
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let arr = []
    db
      .collection('sources')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(source) {
          arr.push(source.data())
        })
      })
      .then(() => {
        this.setState({sources: arr})
      })

  }

  // handleChange(event) {
  //   this.setState({ value: event.target.value })
  // }

  // handleSubmit(evt) {
  //   evt.preventDefault();
  //   var docRef = db.collection('user_input').doc('test_inputs')
  //   docRef.set({
  //     value: this.state.value,
  //     timestamp: new Date()
  //   });
  // }

  render() {
    return (
      <div>
        <div className="news-content">
          {this.state.sources.length &&
            this.state.sources.map(source => (
              <div key={source.id}>
                <Paper
                  zDepth={2}
                  style={{ marginRight: '1em', marginBottom: '1em' }}
                  className="news-card"
                >
                  <div className="news-grid">
                    <img src={source.logo} alt={source.name} className="news-logo" />
                    <p className="news-name">{source.name}</p>
                  </div>
                </Paper>
              </div>
            ))}
        </div>

        {/* <div className="adrien-useless-stuff">
          Dashboard. This is a protected route. You can only see this if you're
          authed.
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={this.state.value}
                onChange={this.handleChange}
              />
            </label>
            <input type="submit" value="Submit" />
            <h2>{this.state.message}</h2>
            Was posted on {this.state.timestamp.toString()}
          </form>
        </div> */}
      </div>
    );
  }
}
