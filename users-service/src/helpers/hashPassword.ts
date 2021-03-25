import { genSaltSync, hashSync } from "bcryptjs";

const hashPassword = (password: string) => hashSync(password, genSaltSync(12));

export default hashPassword;
