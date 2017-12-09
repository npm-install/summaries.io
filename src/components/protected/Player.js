import React, { Component } from 'react'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import PlayIcon from 'material-ui/svg-icons/av/play-arrow'

const playIcon = <PlayIcon />

class Player extends Component {
  state = {
    selectedIndex: 2
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
            label="Play your daily summary"
            icon={playIcon}
            onClick={() => this.select(2)}
          />
        </BottomNavigation>
      </Paper>
    )
  }
}

export default Player
