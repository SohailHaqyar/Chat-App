import UsersService from "#root/adapters/UsersService";

interface Args {
  password: string;
  username: string;
}
const createUserResolver = async (_: any, { password, username }: Args) => {
  return await UsersService.createUser({ password, username });
};

export default createUserResolver;
