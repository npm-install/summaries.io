import React from 'react'

const Article = ({ article }) => {
  console.log(article)
  return (
    <div>
      <a href={article.url} className="article-link">
        {article.title}
      </a>
      <li className="summary-text">{article.summary}</li>
    </div>
  )
}

export default Article
