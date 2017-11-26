import React, { Component } from "react";
import { db } from "../../config/constants";
import { Card, CardHeader, CardText } from "material-ui/Card";
import Paper from "material-ui/Paper";
import Toggle from "material-ui/Toggle";
import Autosuggest from "react-autosuggest";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: [],
      preview: [],
      expanded: false,
      value: "",
      suggestions: []
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this
    );
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this
    );
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

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const getSuggestions = value => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;

      return inputLength === 0
        ? []
        : this.state.sources.filter(
            source =>
              source.name.toLowerCase().slice(0, inputLength) === inputValue
          );
    };

    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    // const { classes } = this.props;
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type a source you want to subscribe",
      value,
      onChange: this.onChange
    };

    const getSuggestionValue = suggestion => suggestion.name;

    const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

    return (
      <div>
        <div className="search-bar">
          <i className="fa fa-search" aria-hidden="true" />
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>

        <div className="news-content">
          <div className="column-left">
            {this.state.sources
              .filter(
                item =>
                  !this.state.value ||
                  item.name
                    .toLowerCase()
                    .indexOf(this.state.value.toLowerCase()) > -1
              )
              .map(source => (
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
                  <Card
                    className="preview-card"
                    style={{ borderRadius: "10px" }}
                  >
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
