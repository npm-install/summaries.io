import React, { Component } from "react";
import { Route, BrowserRouter, Link, Redirect, Switch } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Dashboard from "./protected/Dashboard";
import { logout } from "../helpers/auth";
import { firebaseAuth } from "../config/constants";
import AppBar from "material-ui/AppBar";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import User from "./User";

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )}
    />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )}
    />
  );
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true
  };
  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        });
      } else {
        this.setState({
          authed: false,
          loading: false
        });
      }
    });
  }
  componentWillUnmount() {
    this.removeListener();
  }
  render() {
    console.log(this.state);

    const authButtons = this.state.authed ? (
      <IconMenu
      iconButtonElement={
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      }
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      targetOrigin={{ horizontal: "right", vertical: "top" }}
      iconStyle={{color:'#fff'}}
    >
      <MenuItem primaryText="View Past Summaries" />
      <MenuItem primaryText="Settings" />
      <MenuItem primaryText="Sign Out" onClick={() => {logout();}} />
    </IconMenu>
    ) : (
      <IconMenu
      iconButtonElement={
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      }
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      targetOrigin={{ horizontal: "right", vertical: "top" }}
      iconStyle={{color:'#fff'}}
    >
      <Link to="/login" style={{textDecoration: 'none'}}><MenuItem primaryText="Sign In" /></Link>
      <Link to="/register" style={{textDecoration: 'none'}}><MenuItem primaryText="Sign Up" /></Link>
    </IconMenu>
    );

    const topbarButtons = (
      <div>
        <Link to="/">
          <i className="fa fa-home fa-2x" aria-hidden="true" />
        </Link>
        <Link to="/dashboard">
          <i className="fa fa-sliders fa-2x" aria-hidden="true" />
        </Link>
        {authButtons}
      </div>
    );
    return this.state.loading === true ? (
      <i className="fa fa-spinner fa-4x" aria-hidden="true" />
    ) : (
      <BrowserRouter>
        <div>
          <AppBar
            title="summaries.io"
            iconElementRight={topbarButtons}
            iconStyleRight={{
              display: "flex",
              alignItems: "center",
              marginTop: ".5em"
            }}
            style={{fontFamily: 'Noto Sans, sans-serif'}}
            showMenuIconButton={false}
          />
          <div className="container d-flex justify-content-center">
            <div className="row">
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/user" component={User} />
                <PublicRoute
                  authed={this.state.authed}
                  path="/login"
                  component={Login}
                />
                <PublicRoute
                  authed={this.state.authed}
                  path="/register"
                  component={Register}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  path="/dashboard"
                  component={Dashboard}
                />
                <Route render={() => <h3>No Match</h3>} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
