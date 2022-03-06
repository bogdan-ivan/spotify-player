import React from 'react';
import { getProviders, signIn } from 'next-auth/react';

const Login = (props: any) => {
  const providers = props.providers;
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <img
        src="https://links.papareact.com/9xl"
        alt="Spotify logo"
        className="mb-5 w-52"
      />
      {Object.values(providers).map((provider: any) => {
        return (
          <div key={provider.name}>
            <button
              className="rounded-full bg-green-500 p-5 text-white"
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            >
              Sign in with {provider.name}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Login;

export async function getServerSideProps(context: any) {
  return {
    props: {
      providers: await getProviders(),
    },
  };
}
