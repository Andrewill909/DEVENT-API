import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  rootPath: path.dirname(require.main!.filename),
  serviceName: process.env.SERVICE_NAME,
  secretKey: process.env.SECRET_KEY || 'thisisthesupersecretkeyfordevent',
  dbConnString: process.env.DB_CONN_STRING || 'yourdb',
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'root',
  dbPass: process.env.DB_PASS || 'root',
  dbName: process.env.DB_NAME || 'test',
  hashRounds: process.env.HASH_ROUNDS || '10',
  emailService: process.env.EMAIL_SERVICE || 'none',
  authUserEmail: process.env.AUTH_USER_EMAIL || 'none',
  authUserPassword: process.env.AUTH_USER_PASSWORD || 'none',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'none',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'none',
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL || 'none',
};
