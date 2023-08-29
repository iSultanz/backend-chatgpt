import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.enableCors();

  const port = 3000;
  await app.listen(3000);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
