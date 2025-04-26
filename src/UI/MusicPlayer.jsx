import React, { useState, useRef, useEffect,useCallback } from "react";
import { FaStepBackward, FaStepForward, FaPlay, FaPause } from 'react-icons/fa';
import './MusicPlayer.css';

import nfAudio from './MusicAssets/tracks/ann/NF_-_DRIFTING_72874017.mp3';
import vanyaAudio from './MusicAssets/tracks/ann/Vanya_Dmitrienko_-_Mnogojetazhnye_chuvstva_iz_seriala_Plaksa-2_78702208.mp3';
import aarneAudio from './MusicAssets/tracks/ann/Aarne_BUSHIDO_ZHO_Liza_Evans_-_REVNUYU_78154712.mp3';
import beautifulBoysAudio from './MusicAssets/tracks/elena/Beautiful_Boys_-_Najjdi_menya_b64f0d176.mp3';
import timaAudio from './MusicAssets/tracks/elena/Tima_Belorusskikh_-_Aljonka_65045815.mp3';
import kirillAudio from './MusicAssets/tracks/elena/kirill-mojjton-feat.-beautiful-boys-nezhnaja-ljubov.mp3';
import queenAudio from './MusicAssets/tracks/michael/Queen_-_The_Show_Must_Go_On_47828534.mp3';
import korolAudio from './MusicAssets/tracks/michael/Korol_i_SHut_-_Lesnik_62571704.mp3';
import beatlesAudio from './MusicAssets/tracks/michael/The_Beatles_-_Michelle_47950266.mp3';


import nfImage from './MusicAssets/images/ann/nf-drifting.jpeg';
import vanyaImage from './MusicAssets/images/ann/300x3001.jpeg';
import aarneImage from './MusicAssets/images/ann/CIWhj9YXBGjL6r_JeDe47GaFOvdcO-vNiz16Cs15wOKhnlDxPQCsFwr1QIY49eoVrNVt_D-O-n7FQJQxMUkXTLjy.jpeg';
import beautifulBoysImage from './MusicAssets/images/elena/findme-1000x1000x1.png';
import timaImage from './MusicAssets/images/elena/alenka-1000x1000x1.png';
import kirillImage from './MusicAssets/images/elena/300x300.jpeg';
import queenImage from './MusicAssets/images/michael/300x3002.jpeg';
import korolImage from './MusicAssets/images/michael/300x300.jpeg';
import beatlesImage from './MusicAssets/images/michael/300x3001.jpeg';
function MusicPlayer() {

  const [playlists] = useState([
    {
      id: 1,
      name: "Ann",
      tracks: [
        {
          id: 1,
          title: "DRIFTING",
          artist: "NF",
          audioSrc: nfAudio,
          coverSrc: nfImage
        },
        {
          id: 2,
          title: "Такая нежная любовь",
          artist: "Киррил Мойтон, Beautiful boys",
          audioSrc: kirillAudio,
          coverSrc: kirillImage
        },
        {
          id: 3,
          title: "РЕВНУЮ",
          artist: "Aarne, Bushido zho, Liza Evans",
          audioSrc: aarneAudio,
          coverSrc: aarneImage
        },
      ]
    },
    {
      id: 2,
      name: "Elena",
      tracks: [
        {
          id: 1,
          title: "Найди меня",
          artist: "Beautiful Boys",
          audioSrc: beautifulBoysAudio,
          coverSrc: beautifulBoysImage
        },
        {
          id: 2,
          title: "Аленка",
          artist: "Тима Белорусских",
          audioSrc: timaAudio,
          coverSrc: timaImage
        },
        {
          id: 3,
          title: "Многоэтажные чувства",
          artist: "Ваня Дмитриенко",
          audioSrc: vanyaAudio,
          coverSrc: vanyaImage
        },
      ]
    },
    {
      id: 3,
      name: "Mikhail",
      tracks: [
        {
          id: 1,
          title: "The Show Must Go On",
          artist: "Queen",
          audioSrc: queenAudio,
          coverSrc: queenImage
        },
        {
          id: 2,
          title: "Лесник",
          artist: "Король и Шут",
          audioSrc: korolAudio,
          coverSrc: korolImage
        },
        {
          id: 3,
          title: "Michelle",
          artist: "The Beatles",
          audioSrc: beatlesAudio,
          coverSrc: beatlesImage
        },
      ]
    }
  ]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [state, setState] = useState({
    isPlaying: false,
    progress: 0,
    volume: 0.5 
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const currentPlaylist = playlists[currentPlaylistIndex];
  const currentTrack = currentPlaylist.tracks[currentTrackIndex];

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };  
  const handleNext = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrackIndex(nextIndex);
    
    // Принудительно обновляем состояние воспроизведения
    setState(prev => ({ ...prev, isPlaying: true }));
    
    // Явно запускаем воспроизведение с небольшой задержкой
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      }
    }, 100);
  }, [currentTrackIndex, currentPlaylist.tracks.length]);

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    setCurrentTrackIndex(prevIndex);
    setState(prev => ({ ...prev, isPlaying: true }));
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setState(prev => ({ ...prev, isPlaying: true }));
  };

  const switchPlaylist = (index) => {
    setCurrentPlaylistIndex(index);
    setCurrentTrackIndex(0);
    setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;


    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setState(prev => ({ ...prev, progress: 0 }));
    };
    audio.src = currentTrack.audioSrc;
    audio.load();
    if (state.isPlaying) {
      audio.play().catch(e => console.error("Play error:", e));
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setState(prev => ({
        ...prev,
        progress: (audio.currentTime / audio.duration) * 100 || 0
      }));
    };

    const handleEnded = () => {
      setTimeout(() => {
        handleNext();
      }, 300);
    };

    const handleError = () => {
      console.error("Ошибка загрузки аудио");
      setState(prev => ({ ...prev, isPlaying: false }));
    };
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);    


    audio.volume = state.volume/100;

    return () => {


      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrackIndex, currentPlaylistIndex,currentTrack.audioSrc, state.isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error("Ошибка воспроизведения:", e);
        setState(prev => ({ ...prev, isPlaying: false }));
      });
    }
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleVolumeChange = (e) => {
    const volumeValue = parseInt(e.target.value);
    const normalizedVolume = volumeValue / 100; 
    
    if (audioRef.current) {
      audioRef.current.volume = normalizedVolume;
    }
    
    setState(prev => ({ 
      ...prev, 
      volume: volumeValue 
    }));
  };



  return (
    <div className="player-container">
      <div className="playlists-switcher">
        {playlists.map((playlist, index) => (
          <button 
            key={playlist.id}
            className={`playlist-btn ${index === currentPlaylistIndex ? 'active' : ''}`}
            onClick={() => switchPlaylist(index)}
          >
            {playlist.name}
          </button>
        ))}
      </div>

      <div className="main-div">
        <div className="img-div">
          <img 
            className="track-img" 
            src={currentTrack.coverSrc}
            alt="Track cover"
          />
        </div>
        <div className="track-controls-div">
          <div className="track-naming">
            <label className="track-name">{currentTrack.title}</label>
            <label className="track-prod">{currentTrack.artist}</label>
          </div>
          
          <div className="time-controls">
            <span className="time-current">{formatTime(currentTime)}</span>
            <input 
              type="range" 
              className="tracktime-input"
              value={state.progress}
              onChange={(e) => {
                const newTime = (e.target.value / 100) * duration;
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                }
              }}
            />
            <span className="time-duration">{formatTime(duration)}</span>
          </div>
          
          <div className="controls-div">
  <button className="prev-button control-button" onClick={handlePrev}>
    <FaStepBackward />
  </button>
  <button className="play-button control-button" onClick={togglePlay}>
    {state.isPlaying ? <FaPause /> : <FaPlay />}
  </button>
  <button className="next-button control-button" onClick={handleNext}>
    <FaStepForward />
  </button> 
</div>
          
          <div className="volume-controls">
            <input 
              type="range" 
              className="sound-input"
              min="0"
              max="100"
              value={state.volume}
              onChange={handleVolumeChange}
            />
            <span className="volume-percent">{Math.round(state.volume)}%</span>
          </div>


          <audio 
            ref={audioRef} 
            src={currentTrack.audioSrc} 
            preload="metadata"
          />
        </div>
      </div>

      <div className="playlist-container">
        <h3>{currentPlaylist.name}</h3>
        <div className="playlist">
          {currentPlaylist.tracks.map((track, index) => (
            <div 
              key={track.id} 
              className={`playlist-item ${index === currentTrackIndex ? 'active' : ''}`}
              onClick={() => playTrack(index)}
            >
              <img 
                src={track.coverSrc} 
                alt={track.title} 
                className="playlist-item-cover"
              />
              <div className="playlist-item-info">
                <span className="playlist-item-title">{track.title}</span>
                <span className="playlist-item-artist">{track.artist}</span>
              </div>
              {index === currentTrackIndex && (
                <span className="playlist-item-status">
                  {state.isPlaying ? <FaPlay /> : <FaPause />}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;