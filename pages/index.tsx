import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import Center from '../components/Center';
import { getSession } from 'next-auth/react';
import Player from '../components/Player';

const Home: NextPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Spotify 2</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Center />
        {/* Center */}
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
