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
      sources: [],
      expanded: false
    };
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

      </div>
    );
  }
}
