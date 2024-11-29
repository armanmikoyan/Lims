import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/configs/swagger.config';
import { corsOptions } from './common/configs/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors(corsOptions);
  }

  app.setGlobalPrefix('api/v1');
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
