import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';

class Library extends Component {
  constructor(props){
    super(props);
    this.state = { albums: albumData };
  }
  render(){
    return(
      <section className="library">
      {
        this.state.albums.map( (album, index) =>
          <Link to={`/album/${album.slug}`} key={index} className="library-album">
            <img src={album.albumCover} alt={album.title} className="library-image"/>
            <div className="library-title">{album.title}</div>
            <div className="library-artist">{album.artist}</div>
            <div className="library-songs">{album.songs.length} songs</div>
          </Link>
        )
      }
      </section>
    );
  }
}

export default Library;
