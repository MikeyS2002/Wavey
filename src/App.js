import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdjust } from "@fortawesome/free-solid-svg-icons";

import "./styles/app.scss";
import data from "./data";

import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";

function App() {
  //Ref
  const audioRef = useRef(null);
  //state
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  //Handler
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //calc percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };

  //<div className={`App ${libraryStatus ? 'library-active' : ""}`}>

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <div className="dark-mode-toggle">
        Dark Mode
        <input type="checkbox" onChange={() => setDarkMode(!darkMode)} />
      </div>
      <Song currentSong={currentSong} />
      <Player
        audioRef={audioRef}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        songs={songs}
        setSongs={setSongs}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        darkMode={darkMode}
      />
      <Library
        songs={songs}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setCurrentSong={setCurrentSong}
      />
      <audio
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;
