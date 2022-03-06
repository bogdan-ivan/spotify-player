import React from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { millisToMinutesAndSeconds } from '../lib/time';

const Song = ({ order, track }: any) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    try {
      spotifyApi.play({
        uris: [track.uri],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5
    text-gray-400 hover:bg-gray-900"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order}</p>
        <img
          src={track.album.images[0].url}
          alt="Song image"
          className="h-10 w-10 object-cover"
        />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{track.name}</p>
          <p className="w-40">{track.artists[0].name}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline">{track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
      </div>
    </div>
  );
};

export default Song;
