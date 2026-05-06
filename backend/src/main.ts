import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolveAllowedOrigins } from './common/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: resolveAllowedOrigins() });
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Vigil backend listening on :${port}`);
}
bootstrap();
