import React, { Component } from "react";
import { db } from "../../config/constants";
import { gadgets } from "../DumbyData";
import Paper from "material-ui/Paper";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      message: "",
      timestamp: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    db.doc("user_input/test_inputs").onSnapshot(doc => {
      const data = doc.data();
      this.setState({
        message: data.value || "",
        timestamp: data.timestamp || ""
      });
    });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    var docRef = db.collection("user_input").doc("test_inputs");
    docRef.set({
      value: this.state.value,
      timestamp: new Date()
    });
  }

  render() {
    return (
      <div>
        <div className="news-content">
          {gadgets &&
            gadgets.map(gad => (
              <div key={gad.name}>
                <Paper zDepth={2} style={{marginRight: '1em', marginBottom: '1em', width: '25em'}}>
                  <div className="news-grid">
                    <img src={gad.image} alt={gad.name} className="news-logo" />
                    <p className="news-name">{gad.name}</p>
                  </div>
                </Paper>
              </div>
            ))}
        </div>

        <div>
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
        </div>
      </div>
    );
  }
}
