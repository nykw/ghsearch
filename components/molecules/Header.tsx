import {FC, SyntheticEvent} from "react";
import {signInWithGitHub} from "../../lib/github/account/signIn";
import Link from "next/link";
import getUserInfo from "../../lib/github/userInfo";
import {useDispatch, useSelector} from "react-redux";
import {cookieSlice, CookieState} from "../../features/cookie";
import {signOut} from "../../lib/github/account/signOut";
import {useRouter} from "next/dist/client/router";

type Props = {
  siteName: string;
};

const Header: FC<Props> = ({siteName}) => {
  const {avatarUrl, username, displayName} = useSelector<
    CookieState,
    CookieState
  >((state) => state);
  const dispatch = useDispatch();
  const {register} = cookieSlice.actions;
  const router = useRouter();

  // Sign Inボタンがクリックされたときの処理
  const signInHander = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      // Firebase Authを使ってGitHub認証を使ったサインインを行い、サインインしたユーザー情報を取得する
      const {user} = await signInWithGitHub();

      // GitHubからユーザー情報を取得する
      const userInfo = await getUserInfo(user.username);

      // Reduxにアクションを発行する
      dispatch(
          register({
            displayName: user.displayName,
            avatarUrl: userInfo.avatar_url,
            username: user.username,
          })
      );

      // 検索ページに遷移する
      router.push("/search");
    } catch (e) {
      if (e instanceof Error) {
        // eslint-disable-next-line no-undef
        alert(e.message);
      }
    }
  };

  // Sign Outボタンがクリックされたときの処理
  const signOutHandler = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      // Firebase Authでサインアウトを行う
      await signOut();

      // Reduxにアクションを発行する
      dispatch(
          register({
            displayName: undefined,
            avatarUrl: undefined,
            username: undefined,
          })
      );

      // トップページに遷移する
      router.push("/");
    } catch (e) {
      if (e instanceof Error) {
        // eslint-disable-next-line no-undef
        alert(e.message);
      }
    }
  };

  return (
    <header className="py-3">
      <div className="flex items-center justify-between">
        <div className="p-5">
          <Link href="/" as="/">
            <button className="font-bold text-4xl select-none">
              {siteName}
            </button>
          </Link>
        </div>

        <div className="flex w-1/7 space-x-2 mx-5">
          {displayName && (
            <Link href="/users/[user]" as={`/users/${username}`}>
              <img
                src={avatarUrl!}
                className="h-10 w-10 rounded-full cursor-pointer shadow-sm"
              />
            </Link>
          )}

          {displayName && (
            <Link href="/users/[user]/log" as={`/users/${username}/log`}>
              <button className="btn btn-white">Log</button>
            </Link>
          )}

          <div>
            {displayName ? (
              <button className="btn btn-white " onClick={signOutHandler}>
                Sign out
              </button>
            ) : (
              <button className="btn btn-white" onClick={signInHander}>
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
