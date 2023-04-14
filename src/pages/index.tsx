import { NextPageContext } from 'next';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const Home = () => {
  return (
    <main className="flex h-full w-full">
      <div className="flex flex-col h-full w-full items-center justify-center">
        <h1 className="text-md text-gray-100 font-bold uppercase">WELCOME</h1>
        <Link
          onClick={() => signOut()}
          className="text-sm text-gray-300 underline cursor-pointer uppercase"
          href="/auth"
        >
          LOGOUT
        </Link>
      </div>
    </main>
  );
};

export default Home;
