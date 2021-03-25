import config from "config";
import got from "got";

const USER_SERVICE_URI = <string>config.get("USER_SERVICE_URI");

export default class UsersService {
  static async fetchUserSession({
    sessionId,
  }: {
    sessionId: string;
  }): Promise<UserSession | null> {
    const body = await got
      .get(`${USER_SERVICE_URI}/sessions/${sessionId}`)
      .json();
    if (!body) return null;
    return body as UserSession;
  }

  static async fetchUser({ userId }: { userId: string }): Promise<User | null> {
    const body = await got.get(`${USER_SERVICE_URI}/users/${userId}`).json();
    if (!body) return null;
    return body as User;
  }

  static async createUser({
    password,
    username,
  }: {
    password: string;
    username: string;
  }) {
    const body = await got
      .post(`${USER_SERVICE_URI}/users`, { json: { password, username } })
      .json();
    return body;
  }

  static async createUserSession({
    password,
    username,
  }: {
    password: string;
    username: string;
  }) {
    const body = <UserSession>(
      await got
        .post(`${USER_SERVICE_URI}/sessions`, { json: { password, username } })
        .json()
    );
    return body;
  }
}
export interface UserSession {
  createdAt: string;
  expiresAt: string;
  id: string;
  userId: string;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
}
