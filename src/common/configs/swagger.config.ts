import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

export const setupSwagger = (app: INestApplication): void => {
  const swaggerAccessEndpoint = '/api/v1/swagger';

  const config = new DocumentBuilder()
    .setTitle('E-LAB API')
    .setDescription('API documentation for front-end developers')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('refresh_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerAccessEndpoint, app, document);

  const logger = new Logger('SetupSwagger');
  logger.log(`Swagger setup complete: Access it at ${swaggerAccessEndpoint}`);
};
