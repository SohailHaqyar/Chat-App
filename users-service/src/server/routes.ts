import { Express } from "express";

import { getRepository, getConnection } from "typeorm";

import User from "#root/db/entities/User";
import passwordCompareSync from "#root/helpers/passwordCompareSync";
import generateUUID from "#root/helpers/generateUUID";
import dayjs from "dayjs";
import omit from "lodash.omit";

import config from "config";
import UserSessions from "#root/db/entities/UserSessions";
import hashPassword from "#root/helpers/hashPassword";

const USER_SESSION_EXPIRY_HOUR = config.get("USER_SESSION_EXPIRY_HOUR");

const setupRoutes = (app: Express) => {
  const connection = getConnection();
  const userRepository = getRepository(User);
  const userSessionRepository = getRepository(UserSessions);

  app.get("/users/:userId", async (req, res, next) => {
    try {
      const user = await userRepository.findOne(req.params.userId);
      if (!user) return next(new Error("Invalid user ID"));

      return res.json(user);
    } catch (e) {
      return next(e);
    }
  });

  app.post("/users", async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new Error("Invalid body!"));
    }

    try {
      const newUser = {
        id: generateUUID(),
        passwordHash: hashPassword(password),
        username,
      };

      await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([newUser])
        .execute();

      return res.json(omit(newUser, ["passwordHash"]));
    } catch (e) {
      return next(e);
    }
  });

  app.post("/sessions", async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new Error("Invalid body!"));
    }

    try {
      const user = await userRepository.findOne(
        { username },
        { select: ["id", "passwordHash"] }
      );

      if (!user) return next(new Error("Invalid Username!"));

      if (!passwordCompareSync(password, user.passwordHash)) {
        return next(new Error("Invalid password!"));
      }

      const expiresAt = dayjs()
        .add(USER_SESSION_EXPIRY_HOUR as number, "hour")
        .toISOString();

      const sessionToken = generateUUID();
      const userSession = {
        expiresAt,
        id: sessionToken,
        userId: user.id,
      };

      await connection
        .createQueryBuilder()
        .insert()
        .into(UserSessions)
        .values([userSession])
        .execute();
      return res.json(userSession);
    } catch (err) {
      return next(err);
    }
  });

  app.get("/sessions/:sessionId", async (req, res, next) => {
    try {
      const userSession = await userSessionRepository.findOne(
        req.params.sessionId
      );
      if (!userSession) return next(new Error("Invalid Session ID"));

      return res.json(userSession);
    } catch (err) {
      return next(err);
    }
  });

  app.delete("/sessions/:sessionId", async (req, res, next) => {
    try {
      const userSession = await userSessionRepository.findOne(
        req.params.sessionId
      );
      if (!userSession) return next(new Error("Invalid Session ID"));

      await userSessionRepository.remove(userSession);
      return res.end();
    } catch (err) {
      return next(err);
    }
  });
};

export default setupRoutes;
