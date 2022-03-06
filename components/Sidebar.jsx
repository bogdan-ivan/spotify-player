import React, { useEffect, useState } from 'react';

import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';

const Sidebar = () => {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const spotifyApi = useSpotify();
  console.log(session);

  useEffect(async () => {
    if (spotifyApi.getAccessToken()) {
      const data = await spotifyApi.getUserPlaylists();
      setPlaylists(data.body.items);
    }
  }, [session, spotifyApi]);

  return (
    <div
      className="h-screen overflow-y-scroll border-r border-gray-900 p-5 
    text-xs text-gray-500 scrollbar-hide md:text-sm lg:text-base sm:max-w-[12rem] lg:max-w-[18rem]
    xl:max-w-[20rem] xl:text-lg 2xl:text-xl
    hidden md:inline-flex pb-36"
    >
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white font-bold">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white font-bold">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white font-bold">
          <LibraryIcon className="h-5 w-5" />
          <p>Your library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-800" />

        <button className="flex items-center space-x-2 hover:text-white font-bold">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white font-bold">
          <HeartIcon className="h-5 w-5" />
          <p>Liked songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white font-bold">
          <RssIcon className="h-5 w-5" />
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-800" />
        {/* Playlists */}
        {playlists.map((playlist, index) => (
          <p
            key={playlist.id}
            className="cursor-pointer hover:text-white"
            onClick={() => setPlaylistId(playlist.id)}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
