import React, { Component } from "react";
import Article from "./Article";
import Paper from "material-ui/Paper";

const NYT = [
  {
    source: {
      id: "the-new-york-times",
      name: "The New York Times",
      logo:
        "https://pbs.twimg.com/profile_images/905479981459013637/a6BbKh4k.jpg"
    },
    author: "Cecilia Kang and Michael J. de la Merced",
    title: "U.S. Said to Be Poised to Sue Over AT&T’s Deal for Time Warner",
    description:
      "A Justice Department lawsuit to block the merger would set up a showdown over the first blockbuster acquisition to come before the Trump administration.",
    url:
      "https://www.nytimes.com/2017/11/20/business/dealbook/att-time-warner-merger.html",
    urlToImage:
      "https://static01.nyt.com/images/2017/11/16/business/16ATT1/16ATT1-facebookJumbo.jpg",
    publishedAt: "2017-11-20T21:54:22Z",
    summaryText: `The Justice Department on Monday sued to block AT&T's $85.4 billion bid for Time Warner, setting up a showdown over the first blockbuster acquisition to come before the Trump administration.`
  },
  {
    source: {
      id: "the-new-york-times",
      name: "The New York Times"
    },
    author: "Melissa Eddy and Katrin Bennhold",
    title: "Germany Faces Prolonged Uncertainty After Coalition Talks Fail",
    description:
      "The potential for instability in Germany would be a major blow to a European Union that is finally enjoying an economic revival.",
    url:
      "https://www.nytimes.com/2017/11/20/world/europe/germany-merkel-coalition.html",
    urlToImage:
      "https://static01.nyt.com/images/2017/11/21/world/21Germany/21Germany-facebookJumbo.jpg",
    publishedAt: "2017-11-20T17:28:51Z",
    summaryText: `The collapse of talks reflected the deep reluctance of Ms. Merkel's conservative bloc and prospective coalition partners - the ecologist-minded Greens and pro-business Free Democrats - to compromise over key positions. The political instability stems from the elections in Germany on Sept. 24, when Ms. Merkel's Christian Democrats finished first.`
  },
  {
    source: {
      id: "the-new-york-times",
      name: "The New York Times"
    },
    author: "Mitch Smith",
    title:
      "Nebraska Regulators Approve Alternative Route for Keystone XL Pipeline",
    description:
      "The pipeline that would run from Canada to Nebraska has the support of President Trump, but has been opposed for years by some Nebraska landowners.",
    url:
      "https://www.nytimes.com/2017/11/20/us/nebraska-pipeline-keystone-xl.html",
    urlToImage:
      "https://static01.nyt.com/images/2017/11/14/us/00nebraskapipeline/00nebraskapipeline-facebookJumbo.jpg",
    publishedAt: "2017-11-20T19:41:01Z",
    summaryText: `Nebraska emerged more than seven years ago as an unlikely center of opposition to Keystone XL, which would run more than 1,100 miles from Alberta, Canada, to southern Nebraska and connect there with existing pipelines.`
  }
];

export default class SourceSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [...NYT]
    };
  }

  render() {
    return (
      <div className="source-summary">
        <div className="source-header">
          <img
            src={
              this.state.articles.length && this.state.articles[0].source.logo
            }
            className="sourcelogo"
            alt="logo"
          />
          <h3 className="source-title">
            {this.state.articles.length && this.state.articles[0].source.name}
          </h3>
        </div>
        {this.state.articles.length &&
          this.state.articles.map(article => (
            <Paper zDepth={2} key={article.title}>
              <div className="each-article">
                <Article article={article} />
              </div>
            </Paper>
          ))}
      </div>
    );
  }
}
