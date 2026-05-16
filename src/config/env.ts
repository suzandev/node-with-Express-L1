import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_String: process.env.CONNECTION_STRING as string,
  port: process.env.PORT || 3000,
  secret: process.env.JWT_SECRET,
};

export default config;
