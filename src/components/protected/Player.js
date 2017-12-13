import React, { Component } from 'react'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import PlayIcon from 'material-ui/svg-icons/av/play-arrow'
import { db, firebaseAuth, storage } from '../../config/constants'

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
      // .orderBy('date', 'desc')
      // .limit(1)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(storedEmail) {
          console.log(storedEmail.id, storedEmail.data())
        })
        // return querySnapshot.docs.map(storedEmail => {
        //   const documentContent = storedEmail.data()
        //   console.log('docu content', storedEmail.id, documentContent) // here we have to assume that this is fixed
        //   return documentContent
        // })
      })
      .then(name => {
        storage
          .ref('adrien@alaq.io/2017-12-1.mp3')
          .getDownloadURL()
          .then(url => {
            console.log('file url', url)
            this.setState({ audioFile: url })
          })
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
          {/* <BottomNavigationItem
            label={this.state.audioFile || 'Come back tomorrow for your first summary!'}
            icon={playIcon}
            onClick={() => this.select(2)}
          /> */}
          <audio controls>
            <source
              // src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              src={this.state.audioFile}
              // src="https://firebasestorage.googleapis.com/v0/b/summary-73ccc.appspot.com/o/adrien%40alaq.io%2F2017-12-1.mp3?alt=media"
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
