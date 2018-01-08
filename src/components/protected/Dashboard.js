import React, { Component } from 'react'
import { db, firebaseAuth } from '../../config/constants'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import Toggle from 'material-ui/Toggle'
import Autosuggest from 'react-autosuggest'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sources: [],
      preview: [],
      expanded: false,
      value: '',
      suggestions: [],
      open: false,
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
  }

  componentDidMount() {
    let previewArr = []
    db
      .collection('sources')
      .get()
      .then(function(querySnapshot) {
        return querySnapshot.docs.map(source => source.data())
      })
      .then(arr => {
        this.setState({ sources: arr })
      })
      .then(() => {
        db
          .collection('users')
          .doc(firebaseAuth().currentUser.email)
          .collection('subscriptions')
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              previewArr.push(this.state.sources.filter(source => source.id === doc.id)[0])
            })
          })
          .then(() => {
            this.setState({ preview: previewArr })
          })
      })
  }

  //Toggle helper functions
  handleToggle(el) {
    this.setState(state => {
      const index = state.preview.indexOf(el)
      if (index > -1) {
        const preview = state.preview.slice(0)
        preview.splice(index, 1)

        db
        .collection('users')
        .doc(firebaseAuth().currentUser.email)
        .collection('subscriptions')
        .doc(el.id)
        .delete()

        return { preview }
      } else {

        db
          .collection('users')
          .doc(firebaseAuth().currentUser.email)
          .collection('subscriptions')
          .doc(el.id)
          .set(el)

        return { preview: [...state.preview, el] }
      }
    })
  }

  //----------Search bar helper functions-------------

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    const getSuggestions = value => {
      const inputValue = value.trim().toLowerCase()
      const inputLength = inputValue.length

      return inputLength === 0
        ? []
        : this.state.sources.filter(
            source => source.name.toLowerCase().slice(0, inputLength) === inputValue,
          )
    }

    this.setState({
      suggestions: getSuggestions(value),
    })
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: 'Type a source you want to subscribe',
      value,
      onChange: this.onChange,
    }

    const getSuggestionValue = suggestion => suggestion.name

    const renderSuggestion = suggestion => <div>{suggestion.name}</div>

    return (
      <div>
        <div className="search-bar">
          <i className="fa fa-search fa-2x" aria-hidden="true" />
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>

        <div className="mobile-chips">
          {this.state.preview.length && this.state.preview.map(preview => (
            <Chip
              key={preview.id}
              className="news-chip"
              onRequestDelete={() => this.handleToggle(preview)}
              style={{
                marginRight: '.5em',
                marginTop: '.5em',
                fontFamily: "'Noto Sans', sans-serif",
              }}
            >
              <Avatar src={preview.logo} />
              {preview.name}
            </Chip>
          ))}
        </div>

        <div className="news-content">
          <div className="column-left">
            {this.state.sources
              .filter(
                item =>
                  !this.state.value ||
                  item.name.toLowerCase().indexOf(this.state.value.toLowerCase()) > -1,
              )
              .map(source => (
                <div key={source.id}>
                  <Card className="news-card" style={{ borderRadius: '10px' }}>
                    <CardHeader
                      title={source.name}
                      avatar={source.logo}
                      actAsExpander={true}
                      showExpandableButton={true}
                      titleStyle={{
                        fontSize: '1em',
                        fontFamily: 'Noto Sans, sans-serif',
                        marginTop: '.5em',
                      }}
                    />
                    <Toggle
                      onToggle={() => this.handleToggle(source)}
                      className="news-toggle"
                      toggled={this.state.preview.indexOf(source) > -1}
                    />
                    <CardText
                      expandable={true}
                      style={{ width: '20em' }}
                      className="news-card-description"
                    >
                      <p>{source.description}</p>
                    </CardText>

                    {/* mobile settings */}
                    <CardText
                      expandable={true}
                      style={{ width: '20em' }}
                      className="news-card-mobile-settings"
                    >
                      <div className="add-keyword">
                        <TextField hintText="Keywords" name="keywords" className="keyword-input" />
                        <button style={{ border: 'none', background: 'none' }}>
                          <i className="fa fa-plus-circle" aria-hidden="true" />
                        </button>
                      </div>
                      <SelectField
                        floatingLabelText="Number of Articles"
                        className="number-articles"
                      >
                        <MenuItem value={1} primaryText="1" />
                        <MenuItem value={3} primaryText="3" />
                        <MenuItem value={5} primaryText="5" />
                        <MenuItem value={10} primaryText="10" />
                      </SelectField>
                    </CardText>
                  </Card>
                </div>
              ))}
          </div>

          <div className="column-right">
            <Paper style={{ width: '800px', height: '100vh', borderRadius: '20px' }} zDepth={3}>
              <div className="email-header">
                <p>From: email@summaries.io</p>
                <p>To: {firebaseAuth().currentUser.email}</p>
                <p>Subject: Your Daily Gist</p>
              </div>

              <div className="preview-cards">
              {this.state.preview.map(preview => (
                <div key={preview.id} className="preview-grid">
                  <Card className="preview-card" style={{ borderRadius: '10px' }}>
                    <CardHeader
                      title={preview.name}
                      avatar={preview.logo}
                      subtitle={preview.description}
                      actAsExpander={true}
                      showExpandableButton={true}
                      titleStyle={{
                        fontSize: '1em',
                        fontFamily: 'Noto Sans, sans-serif',
                        marginTop: '.5em',
                      }}
                    />
                    <CardText expandable={true} className="expanded">
                      <div className="add-keyword">
                        <TextField hintText="Keywords" name="keywords" className="keyword-input" />
                        <button style={{ border: 'none' }}>
                          <i className="fa fa-plus-circle" aria-hidden="true" />
                        </button>
                      </div>
                      <SelectField
                        floatingLabelText="Number of Articles"
                        className="number-articles"
                      >
                        <MenuItem value={1} primaryText="1" />
                        <MenuItem value={3} primaryText="3" />
                        <MenuItem value={5} primaryText="5" />
                        <MenuItem value={10} primaryText="10" />
                      </SelectField>
                    </CardText>
                  </Card>
                </div>
              ))}
              </div>
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}
