import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import spotifyApi from '../lib/spotify';

const useSpotify = () => {
  const { data: session, status }: any = useSession();
  useEffect(() => {
    if (session) {
      // If refresh token attempt fials direct user to login
      if (session.error === 'RefreshAccessTokenError') {
        signIn();
      }
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);
  return spotifyApi;
};

export default useSpotify;
