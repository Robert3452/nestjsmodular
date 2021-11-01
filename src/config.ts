import { registerAs } from '@nestjs/config'
export default registerAs('config', () => ({
  database: {
    name: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  },
  apiKey: process.env.API_KEY,
}));
