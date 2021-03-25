import { Request, Response, NextFunction } from "express";

import UsersService from "#root/adapters/UsersService";

const injectSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.userSessionId) {
    const userSession = await UsersService.fetchUserSession({
      sessionId: req.cookies.userSessionId,
    });
    res.locals.userSession = userSession;
    console.log("user session injected brah", userSession);
  }

  return next();
};

export default injectSession;
