import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom';
import useSpotify from './useSpotify';

const useSongInfo = () => {
  const spotifyApi = useSpotify();
  const currentTrackId = useRecoilValue(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}
            `,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        );
        setSongInfo(await trackInfo.json());
      }
    };
    fetchSongInfo();
  }, [spotifyApi, currentTrackId]);
  
  return songInfo;
};

export default useSongInfo;
