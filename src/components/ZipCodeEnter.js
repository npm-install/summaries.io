import React from 'react'
import Paper from 'material-ui/Paper';


const ZipCode = (props) => (
  <div>
    <Paper zDepth={2} className="article-card">
      <div className="zipcode-input">
        <h3>Enter your zip code to get weather!</h3>
        <form onSubmit={props.submitHandler} className="form-zip">
          <label htmlFor="zip">Zip Code:</label>
          <input id="zip-input" name="zip" placeholder="10001" type="number" step="1" min="00000" max="99999" />
          <button type="submit" id="weather-btn" className="btn btn-primary">
            Submit
      </button>
        </form>
      </div>
    </Paper>
  </div>
)

export default ZipCode
