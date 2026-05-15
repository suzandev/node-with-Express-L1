import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age } = payload;
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, age)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
    [name, email, password, age],
  );
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
    SELECT * FROM users
      `);
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users WHERE id = $1
      `,
    [id],
  );
  return result;
};

const updateUserByIdInDB = async (payload: IUser, id: string) => {
  const { name, email, password, age } = payload;
  const result = await pool.query(
    `
        UPDATE users SET name = COALESCE($1, name),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        age = COALESCE($4, age)
        WHERE id = $5
        RETURNING *
      `,
    [name, email, password, age, id],
  );
  return result;
};

const deleteUserByIdFromDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id = $1
      RETURNING *

      `,
    [id],
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserByIdInDB,
  deleteUserByIdFromDB,
};
