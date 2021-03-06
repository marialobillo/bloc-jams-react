import React, { Component } from 'react';
import albumData from './../data/albums';
import Ionicon from 'react-ionicons';
import PlayerBar from './PlayerBar';

class Album extends Component{
  constructor(props){
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      isHoveredSong: null,
      currentHoveredSong: null,
      currentTime: 0,
      duration: album.songs[0].duration,
      currentVolume: 0.4,
      volume: 1

    };
    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }
  play(){
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }
  pause(){
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }
  setSong(song){
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }
  handleSongClick(song){
    const isSameSong = this.state.currentSong === song;
    if(this.state.isPlaying && isSameSong ){
      this.pause();
    } else {
      if(!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  toggleButton(song){
    if(this.state.isPlaying && this.state.currentSong === song){
      return "md-pause";
    } else {
      return "md-play";
    }
  }

  handlePrevClick(){
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }
  handleNextClick(){
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e){
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }
  componentDidMount(){
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumechange: e => {
        this.setState({ currentVolume: this.audioElement.currentVolume });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange', this.eventListeners.volumenchange);
  }
  componentWillUnmount(){
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumenchange);
  }
  formatTime(time){
    if((!isNaN(parseFloat(time)) && isFinite(time)) || (time < 599)){
      let minutes = Math.trunc(time / 60)
      let seconds = Math.trunc(time % 60)
      if(seconds <= 9){
        return `${minutes}:0${seconds}`
      } else {
        return `${minutes}:${seconds}`
      }
    } else {
      return "-:--"
    }
  }
  handleVolumeChange(e){
    const currentVolume = e.target.value;
    this.audioElement.volume = currentVolume;
    this.setState({currentVolume});
  }
  render(){
    return(
      <section className="album">
        <section id="album-info">
            <div className="album-cover">
              <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
            </div>
            <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" className="song-track"/>
            <col id="song-title-column" className="song-track"/>
            <col id="song-duration-column" className="song-tract"/>
          </colgroup>
          <tbody>
            {
              this.state.album.songs.map( (song, index) =>
                <tr key={index}
                    className="song"
                    onClick={() => this.handleSongClick(song)}
                    onMouseEnter={() => this.setState({isHoveredSong: index + 1})}
                    onMouseLeave={() => this.setState({isHoveredSong: null})}
                  >
                  <td>
                    { this.state.isHoveredSong === (index + 1)  ?
                      <span><Ionicon icon={this.toggleButton(song)} /></span> :
                      (index + 1) }

                  </td>
                  <td>{song.title}</td>
                  <td>{this.formatTime(song.duration)}</td>
                </tr>
              )
            }
          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          currentTime={this.audioElement.currentTime}
          duration={this.formatTime(this.audioElement.duration)}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          currentVolume={this.state.currentVolume}
          volume={this.audioElement.volume}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={(e) => this.formatTime(this.state.currentTime)}
        />
      </section>
    )
  }
}

export default Album;
