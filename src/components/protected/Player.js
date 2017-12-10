import React, { Component } from 'react'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import PlayIcon from 'material-ui/svg-icons/av/play-arrow'
import { db, firebaseAuth } from '../../config/constants'

const playIcon = <PlayIcon />

class Player extends Component {
  state = {
    selectedIndex: 2
  }

  componentDidMount() {
    console.log(firebaseAuth().currentUser.email)
    db
      .collection('users')
      .doc(firebaseAuth().currentUser.email)
      .collection('emails')
      // .orderBy('date', 'desc') // Needs to be edited to fetch the last one, and not the first one
      .limit(1)
      .get()
      .then(function(querySnapshot) {
        return querySnapshot.docs.map(email => {
          const documentContent = email.data()
          return documentContent
        })
      })
      .then(name => {
        // here we change the state to show the current file
        this.setState({ audioFile: name.audio })
      })
      .catch(console.log)
  }

  select = index => this.setState({ selectedIndex: index })

  render() {
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          {/* <BottomNavigationItem label="Recents" icon={recentsIcon} onClick={() => this.select(0)} />
          <BottomNavigationItem
            label="Favorites"
            icon={favoritesIcon}
            onClick={() => this.select(1)}
          /> */}
          <BottomNavigationItem
            label={this.state.audioFile || 'Come back tomorrow for your first summary!'}
            icon={playIcon}
            onClick={() => this.select(2)}
          />
          <audio controls>
            <source
              src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
        </BottomNavigation>
      </Paper>
    )
  }
}

export default Player
