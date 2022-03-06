import React from 'react';
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import Song from './Song';

const Songs = () => {
  const playlist: any = useRecoilValue(playlistState);
  return (
    <div className='px-8 flex flex-col space-y-1 pb-28 text-white'>
      {playlist?.tracks.items.map((track: any, index: number) => (
        <Song key={track.track.id} order={index + 1} track={track.track} />
      ))}
    </div>
  );
};

export default Songs;
