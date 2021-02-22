import Template from '../components/molcules/template';
import { loginWithGoogle } from '../lib/github/login';
import { SyntheticEvent } from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  const handleClick = async (e: SyntheticEvent<HTMLButtonElement>) => {
    try {
      const user = await loginWithGoogle();
      console.log(user);
      router.push('/search');
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
      router.push('/');
    }
  };

  return (
    <Template pageName="GitHub Search">
      <button
        className="bg-blue-700 h-10 w-20 font-bold text-white rounded-md"
        onClick={handleClick}
      >
        ログイン
      </button>
    </Template>
  );
}
