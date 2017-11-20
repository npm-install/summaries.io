import React from 'react';

const Article = ({ article }) => (
  <div>
    <h4>{article.title}</h4>
    <li>{article.summaryText}</li>
  </div>
);

export default Article;
