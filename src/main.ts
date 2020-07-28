import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateEnvironmentVariables } from './core/utils';
async function bootstrap() {
  ValidateEnvironmentVariables();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
}
bootstrap();
