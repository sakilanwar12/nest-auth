import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ZodValidationPipe());
  setupSwagger(app);
  app.enableCors();
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Application docs: http://localhost:3000/api/docs');
}
bootstrap().catch((err) => {
  console.error('Error starting app:', err);
  process.exit(1);
});
