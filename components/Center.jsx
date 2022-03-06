import { ChevronDownIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
  'from-orange-500',
  'from-emerald-500',
  'from-teal-500',
  'from-sky-500',
  'from-violet-500',
];

const Center = () => {
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const spotifyApi = useSpotify();

  const [showDropdown, setShowDropdown] = useState('hidden');

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(async () => {
    try {
      const data = await spotifyApi.getPlaylist(playlistId);
      setPlaylist(data.body);
    } catch (error) {
      console.log(error);
    }
  }, [spotifyApi, playlistId]);

  console.log(playlist);

  return (
    <div className="h-screen flex-grow overflow-y-scroll text-white scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="relative flex cursor-pointer items-center space-x-3 rounded-3xl
          bg-black p-1 pr-2 opacity-90 hover:opacity-80"
          onClick={() => {
            if (showDropdown == 'hidden') {
              setShowDropdown('inline');
            } else {
              setShowDropdown('hidden');
            }
          }}
        >
          <img
            src={session?.user?.image}
            alt="Profile picture"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
          <button
            className={`flex items-center space-x-2 hover:text-white ${showDropdown}
            absolute top-14 right-14 rounded-full bg-black p-1 px-3`}
            onClick={() => signOut()}
          >
            <p>Log out</p>
          </button>
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color}
      to-black p-8 text-white`}
      >
        <img
          src={playlist?.images?.[0].url}
          alt=""
          className="h-44 w-44 shadow-2xl"
        />
        <div>
          <p className="text-sm font-semibold">PLAYLIST</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <Songs />
    </div>
  );
};

export default Center;
