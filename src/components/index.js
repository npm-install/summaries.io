import React, { Component } from 'react'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Landing from './Landing'
import Dashboard from './protected/Dashboard'
import Player from './protected/Player'
import { logout, saveUser } from '../helpers/auth'
import { firebaseAuth } from '../config/constants'
import AppBar from 'material-ui/AppBar'
import User from './User'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import CircularProgress from 'material-ui/CircularProgress'
import { db } from '../config/constants'

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        (authed === true ? (
          <Component {...rest} /> // was {...props}
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        ))
      }
    />
  )
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (authed === false ? <Component {...props} /> : <Redirect to="/dashboard" />)}
    />
  )
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true
  }
  componentDidMount() {
    firebaseAuth()
      .getRedirectResult()
      .then(function(authData) {
        console.log(authData)
        saveUser(authData.user)
      })
      .catch(function(error) {
        console.log(error)
      })

    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      // Now let's modify the state with user information and auth
      console.log('auth has changed', user)
      if (user) {
        // Let's retrieve the user's information
        var userRef = db.collection('users')
        userRef
          .where('uid', '==', user.uid)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              this.setState({
                authed: true,
                loading: false,
                user: doc.data() // make sure this is synchronous
              })
            })
          })
          .catch(err => {
            console.log('Error getting documents', err)
          })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  componentWillUnmount() {
    this.removeListener()
  }
  render() {
    console.log(this.state)

    const authButtons = this.state.authed ? (
      <IconMenu
        iconButtonElement={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        iconStyle={{ color: '#fff' }}
      >
        <Link to="/account" style={{ textDecoration: 'none' }}>
          <MenuItem primaryText="My Profile" />
        </Link>
        <MenuItem
          primaryText="Sign out"
          onClick={() => {
            logout()
          }}
        />
      </IconMenu>
    ) : (
      <IconMenu
        iconButtonElement={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        iconStyle={{ color: '#fff' }}
      >
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <MenuItem primaryText="Sign In" />
        </Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <MenuItem primaryText="Sign Up" />
        </Link>
      </IconMenu>
    )

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
    )
    return this.state.loading === true ? (
      <CircularProgress size={80} thickness={5} style={{ marginLeft: '45vw', marginTop: '45vh' }} />
    ) : (
      <BrowserRouter>
        <div>
          <AppBar
            title="summaries.io"
            iconElementRight={topbarButtons}
            iconStyleRight={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '.5em'
            }}
            style={{ fontFamily: 'Noto Sans, sans-serif', position: 'fixed' }}
            showMenuIconButton={false}
            className="app-bar"
          />
          <div className="container d-flex justify-content-center">
            <div className="row">
              <Switch>
                <Route path="/" exact component={this.state.authed ? Home : Landing} />
                <PublicRoute authed={this.state.authed} path="/login" component={Login} />
                <PublicRoute authed={this.state.authed} path="/register" component={Register} />
                <PrivateRoute authed={this.state.authed} path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  authed={this.state.authed}
                  path="/account"
                  user={this.state.user}
                  component={User}
                />
                <Route render={() => <h3>No Match</h3>} />
              </Switch>
            </div>
          </div>
          {this.state.authed ? <Player style={{ position: 'absolute' }} /> : ''}
        </div>
      </BrowserRouter>
    )
  }
}
