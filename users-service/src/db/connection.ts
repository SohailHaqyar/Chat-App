import config from "config";

import { Connection, createConnection } from "typeorm";

import User from "./entities/User";
import UserSessions from "./entities/UserSessions";
let connection: Connection;

export const initConnection = async () => {
  connection = await createConnection({
    entities: [User, UserSessions],
    type: "mysql",
    url: config.get("USER_SERVICE_DB_URL") as string,
  });
};

const getConnection = () => connection;
export default getConnection;
