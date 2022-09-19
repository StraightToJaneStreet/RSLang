import * as React from 'react';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import SyncIcon from '@mui/icons-material/Sync';

interface IAudiPlayerProps {
  tracks: string[];
}

const AudioPlayer = (props: IAudiPlayerProps) => {
  const [isPlaying, setPlay] = useState(false);
  const sources = props.tracks.map((url) => new Audio(url));

  const playAudio = async (audio: HTMLAudioElement) => {
    return new Promise((res) => {
      audio.play();
      audio.onended = res;
    });
  };

  const handleClick = async () => {
    setPlay(true);
    for (const track of sources) {
      await playAudio(track);
    }
    setPlay(false);
  };

  return (
    <Fab size="small" onClick={handleClick} disabled={isPlaying}>
      {!isPlaying ? (
        <PlayArrowIcon />
      ) : (
        <SyncIcon
          sx={{
            animation: 'spin 2s linear infinite',
            '@keyframes spin': {
              '0%': {
                transform: 'rotate(360deg)',
              },
              '100%': {
                transform: 'rotate(0deg)',
              },
            },
          }}
        />
      )}
    </Fab>
  );
};

export default AudioPlayer;
