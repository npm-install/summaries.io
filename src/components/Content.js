import React from 'react';
import Paper from 'material-ui/Paper';
import { sources } from './DumbyData';

const Content = props => {
  const provider = sources;
  return (
    <div className="source-list">
      {provider.map(source => (
        <Paper zDepth={2} key={source.name} className="source-paper">
          <div className="content-wrap">
            <div className="img-wrap">
              <img src={source.img} alt={source.name} className="source-logo" />
            </div>
            <div className="source-grid">
              <h5 className="source-title">{source.name}</h5>
              <p>{source.des}</p>
            </div>
          </div>
        </Paper>
      ))}
    </div>
  );
};

export default Content;
