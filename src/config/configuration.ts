import 'dotenv/config';

export default () => ({
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: parseInt(process.env.PORT!, 10) || 3000,
});
