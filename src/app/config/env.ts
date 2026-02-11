import dotenv from "dotenv";

dotenv.config();

interface IEnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "Development" | "Production";
  BCRYPT_SALT_ROUND: string;
  // Super Admin
  SUPER_ADMIN: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
}

const loadEnvVariables = (): IEnvConfig => {
  const requiredEnvVariable: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    // Super Admin
    "SUPER_ADMIN",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
  ];
  requiredEnvVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missinng required environment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    // Super Admin
    SUPER_ADMIN: process.env.SUPER_ADMIN as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
  };
};

export const envVars = loadEnvVariables();
