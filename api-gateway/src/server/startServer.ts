import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "#root/graphql/schema";

import config from "config";
import resolvers from "#root/graphql/resolvers";
import formatGraphQLErrors from "./formatGraphQLErrors";
import cookieParser from "cookie-parser";
import cors from "cors";
import injectSession from "./middleware/injectSession";

const PORT = config.get("PORT");

const startServer = () => {
  const apolloServer = new ApolloServer({
    context: (a) => a,
    formatError: formatGraphQLErrors,
    resolvers,
    typeDefs: schema,
  });
  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: (origin, cb) => cb(null, true),
    })
  );
  app.use(injectSession);

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(PORT as number, "0.0.0.0", () =>
    console.info(`API gateway is on http://localhost:${PORT}/graphql`)
  );
};

export default startServer;
