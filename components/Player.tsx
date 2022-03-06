import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeOffIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import {
  PlayIcon as PlayIconSolid,
  VolumeUpIcon as VolumeUpIcon,
  VolumeOffIcon as VolumeOffIconSolid,
} from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';
import { debounce } from 'lodash';

const Player = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId]: any =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(50);
  const songInfo: any = useSongInfo();

  const fetchCurrentSong = async () => {
    if (!songInfo) {
      try {
        const track = await spotifyApi.getMyCurrentPlayingTrack();
        setCurrentTrackId(track.body?.item?.id);
        const playbackState = await spotifyApi.getMyCurrentPlaybackState();
        setIsPlaying(playbackState.body?.is_playing);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch the song info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [spotifyApi, currentTrackId, session]);

  const handlePlayPause = async () => {
    try {
      const playback = await spotifyApi.getMyCurrentPlaybackState();
      if (playback.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMute = () => {
    if (volume !== 0) {
      setVolumeBeforeMute(volume);
      setVolume(0);
    } else {
      setVolume(volumeBeforeMute);
    }
  };

  const handleVolume = (mode: string) => {
    if (mode === 'increase' && volume < 100) {
      setVolume((prev) => prev + 5);
    } else if (mode === 'decrease' && volume > 0) {
      setVolume((prev) => prev - 5);
    }
  };

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      try {
        spotifyApi.setVolume(volume);
      } catch (error) {
        console.log(error);
      }
    }, 500),
    []
  );

  return (
    <div
      className="grid grid-cols-3 bg-gradient-to-b from-black to-gray-500 px-2
    text-xs md:px-8 md:text-base"
    >
      {/* Left */}
      <div className="flex items-center space-x-4 p-1 text-white">
        <img
          src={songInfo?.album?.images[0].url}
          alt="Player song image"
          className="hidden h-24 w-24 md:inline"
        />
        <div>
          <h1>{songInfo?.name}</h1>
          <p className="text-gray-400">{songInfo?.artists?.[0].name}</p>
        </div>
      </div>

      {/* Middle */}
      <div className="flex items-center justify-evenly text-white">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"
          onClick={() => spotifyApi.skipToPrevious()}
        />
        {isPlaying ? (
          <PauseIcon className="button h-15 w-15" onClick={handlePlayPause} />
        ) : (
          <PlayIconSolid
            className="button h-15 w-15"
            onClick={handlePlayPause}
          />
        )}

        <FastForwardIcon
          className="button"
          onClick={() => spotifyApi.skipToNext()}
        />
        <ReplyIcon className="button" />
      </div>

      {/* Right */}
      <div className="flex items-center justify-end space-x-3 pr-5 text-white md:space-x-4">
        {volume !== 0 ? (
          <VolumeOffIcon className="sound-button" onClick={handleMute} />
        ) : (
          <VolumeOffIconSolid className="sound-button" onClick={handleMute} />
        )}

        <VolumeDownIcon
          className="sound-button"
          onClick={() => handleVolume('decrease')}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="sound-button"
          onClick={() => handleVolume('increase')}
        />
      </div>
    </div>
  );
};

export default Player;
