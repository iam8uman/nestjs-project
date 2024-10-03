import { config } from 'dotenv';

// Load environment variables from .env file
config();

function getEnvVariable(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export const DATABASE_URL = getEnvVariable('DATABASE_URL');
export const DATABASE_URL_PROD = getEnvVariable('DATABASE_URL_PROD');
export const JWT_SECRET = getEnvVariable('JWT_SECRET');
export const PORT = getEnvVariable('PORT', '8000'); // Default to 3000 if not set
