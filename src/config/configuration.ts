import 'dotenv/config';

export default () => ({
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: parseInt(process.env.PORT!, 10) || 3000,
  JWT_SECRET_FOR_REFRESH_TOKEN: process.env.JWT_SECRET_FOR_REFRESH_TOKEN,
  JWT_SECRET_FOR_ACCESS_TOKEN: process.env.JWT_SECRET_FOR_ACCESS_TOKEN
});
