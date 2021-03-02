import firebase from 'firebase/app';
// import 'firebase/auth';

import { auth } from './auth';

type User = {
  displayName: string;
  email?: string;
};

type Credential = {
  accessToken: string;
  providerId: string;
  signInMethod: string;
};

type Result = {
  user: User;
  credential: Credential;
};

/** GitHubアカウントを使ったサインインを行います。 */
export const signInWithGitHub = async (): Promise<Result> => {
  // see https://firebase.google.com/docs/auth/web/github-auth?hl=ja#handle_the_sign-in_flow_with_the_firebase_sdk
  const provider = new firebase.auth.GithubAuthProvider();
  provider.setCustomParameters({
    client_id: process.env.CLIENT_ID,
  });

  try {
    const {
      user,
      credential,
    }: { user: User; credential: Credential } = (await auth.signInWithPopup(provider)) as any;

    const { displayName, email } = user;
    const { accessToken, providerId, signInMethod } = credential;

    return { user: { displayName, email }, credential: { accessToken, providerId, signInMethod } };
  } catch (e) {
    // see https://firebase.google.com/docs/reference/js/firebase.auth.Auth?hl=ja#signinandretrievedatawithcredential
    switch (e.code as string) {
      case 'auth/account-exists-with-different-credential':
        throw new Error(
          '資格情報によって表明された電子メールアドレスを持つアカウントがすでに存在します。',
        );
      case 'auth/invalid-credential':
        throw new Error('資格情報の形式が正しくないか、有効期限が切れています。');
      case 'auth/operation-not-allowed':
        throw new Error();
      case 'auth/user-disabled':
        throw new Error();
      case 'auth/user-not-found':
        throw new Error();
      case 'auth/wrong-password':
        throw new Error();
      case 'auth/invalid-verification-code':
        throw new Error();
      case 'auth/invalid-verification-id':
        throw new Error();
      case 'auth/unauthorized-domain':
        throw new Error('このドメインは承認済みドメインではありません。');
      default:
        throw new Error('予期しないエラーです。');
    }
  }
};
