import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const checkPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
