import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/env";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);

  console.log("matchPassword", matchPassword);
  if (!matchPassword) {
    throw new Error("Invalid password");
  }

  // Generate JWT token here and return to the client

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    is_active: user.is_active,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });
  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
};
