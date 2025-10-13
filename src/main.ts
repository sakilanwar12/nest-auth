import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { ResponseInterceptor } from './lib/interceptors/response.interceptors';
import { AllExceptionsFilter } from './lib/interceptors/exception.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap().catch((err) => {
  console.error('Error starting app:', err);
  process.exit(1);
});
