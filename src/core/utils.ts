import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
import * as path from 'path';
const NODE_ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};
const DotEnvOptions = () => {
  if (process.env.NODE_ENV === 'production') return;
  dotenv.config();
};
export const ValidateEnvironmentVariables = () => {
  DotEnvOptions();
  const Schema = Joi.object({
    NODE_ENV: Joi.string()
      .valid('development','production').required(),
    PORT: Joi.string().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().allow(""),
    POSTGRES_DB: Joi.string().required(),
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.string().required(),
  });
  const { error, value } = Schema.validate(process.env, {
    stripUnknown: true,
  });
  console.log(process.env.POSTGRES_USER)
  if (error) {
    console.error(error);
    throw new Error('Check environment variables!'); 
  }
  return value;
};

export enum TransactionType {
  TRANSFER = 'transfer',
  REFILL = 'refill',
}
