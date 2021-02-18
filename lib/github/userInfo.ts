// GET /users/{username} APIの正常系の型
export type User = {
  avatar_url: string;
  bio: string | undefined;
  blog: string | undefined;
  company: string | undefined;
  created_at: string | undefined;
  email: string | undefined;
  events_url: string | undefined;
  followers: number;
  followers_url: string | undefined;
  following: number;
  following_url: string | undefined;
  gists_url: string | undefined;
  gravatar_id: string | undefined;
  hireable: boolean | undefined;
  html_url: string | undefined;
  id: number;
  location: string | undefined;
  login: string;
  name: string | undefined;
  node_id: string | undefined;
  organizations_url: string | undefined;
  public_gists: number | undefined;
  public_repos: number | undefined;
  received_events_url: string | undefined;
  repos_url: string | undefined;
  site_admin: boolean | undefined;
  starred_url: string | undefined;
  subscriptions_url: string | undefined;
  twitter_username: string | undefined;
  type: string | undefined;
  updated_at: string | undefined;
  url: string | undefined;
};

type Result =
  | User
  | {
      message: string;
    };

// 該当ユーザーが存在しないとき
//   {"message":"Not Found", ...}
// のようなレスポンスがある。
const isUser = (data: Result): data is User => !('message' in data);

export default async function getUserInfo(user: string | string[]) {
  if (typeof user === 'object') throw new Error('不正なユーザー名です。');

  const res = await fetch(`https://api.github.com/users/${user}`);
  const data: Result = await res.json();

  if (!isUser(data)) throw new Error('存在しないユーザーです。');

  return data;
}