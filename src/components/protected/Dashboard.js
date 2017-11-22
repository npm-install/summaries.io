import React, { Component } from 'react';
import { db } from '../../config/constants';
import {
  Card,
  CardHeader,
  CardText
} from 'material-ui/Card';
import Paper from 'material-ui/Paper'

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      // value: '',
      // message: '',
      // timestamp: '',
      sources: [],
      expanded: false
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let arr = [];
    db
      .collection('sources')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(source) {
          arr.push(source.data());
        });
      })
      .then(() => {
        this.setState({ sources: arr });
      });
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

         <div className="column-left">
          {this.state.sources.map(source => (
            <div key={source.id}>
              <Card className="news-card" style={{borderRadius: '10px'}}>
                <CardHeader
                  title={source.name}
                  avatar={source.logo}
                  actAsExpander={true}
                  showExpandableButton={true}
                  titleStyle={{fontSize: '1em', fontFamily: 'Noto Sans, sans-serif', marginTop: '.5em'}}
                />
                <CardText expandable={true} style={{width: '20em'}}>
                  <p>{source.description}</p>
                </CardText>
              </Card>
            </div>
          ))}
          </div>

          <div className="column-right">
            <Paper
              style={{width: '800px', height: '3000px', borderRadius: '20px'}}
              zDepth={3}
            ></Paper>
          </div>
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
