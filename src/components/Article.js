import React from 'react';

const Article = ({ article }) => (
  <div>
    <a href={article.url} className="article-link">
      {article.title}
    </a>
    <li className="summary-text">{article.summaryText}</li>
  </div>
);

export default Article;
