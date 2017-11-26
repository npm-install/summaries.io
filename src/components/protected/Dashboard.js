import React, { Component } from "react";
import { db } from "../../config/constants";
import { Card, CardHeader, CardText } from "material-ui/Card";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import Toggle from "material-ui/Toggle";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: [],
      preview: [],
      expanded: false
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    let arr = [];
    db
      .collection("sources")
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

  handleToggle(el) {
    this.setState(state => {
      const index = state.preview.indexOf(el);
      if (index > -1) {
        const preview = state.preview.slice(0);
        preview.splice(index, 1);
        return { preview };
      }

      return { preview: [...state.preview, el] };
    });
  }

  render() {
    // const { classes } = this.props;

    return (
      <div>
        <div className="search-bar">
          <i className="fa fa-search" aria-hidden="true" />
          <TextField
            id="search"
            label="Search field"
            type="search"
            // className={classes.textField}
          />
        </div>

        <div className="news-content">
          <div className="column-left">
            {this.state.sources.map(source => (
              <div key={source.id}>
                <Card className="news-card" style={{ borderRadius: "10px" }}>
                  <CardHeader
                    title={source.name}
                    avatar={source.logo}
                    actAsExpander={true}
                    showExpandableButton={true}
                    titleStyle={{
                      fontSize: "1em",
                      fontFamily: "Noto Sans, sans-serif",
                      marginTop: ".5em"
                    }}
                  />
                  <Toggle
                    onToggle={() => this.handleToggle(source)}
                    className="news-toggle"
                  />
                  <CardText expandable={true} style={{ width: "20em" }}>
                    <p>{source.description}</p>
                  </CardText>
                </Card>
              </div>
            ))}
          </div>

          <div className="column-right">
            <Paper
              style={{ width: "800px", height: "100vh", borderRadius: "20px" }}
              zDepth={3}
            >
              {this.state.preview.map(preview => (
                <div key={preview.id} className="preview-grid">
                  <Card className="preview-card" style={{ borderRadius: "10px" }}>
                    <CardHeader
                      title={preview.name}
                      avatar={preview.logo}
                      subtitle={preview.description}
                      actAsExpander={true}
                      showExpandableButton={true}
                      titleStyle={{
                        fontSize: "1em",
                        fontFamily: "Noto Sans, sans-serif",
                        marginTop: ".5em"
                      }}
                    />
                    <CardText expandable={true}>
                      <p>{preview.description}</p>
                    </CardText>
                  </Card>
                </div>
              ))}
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}
