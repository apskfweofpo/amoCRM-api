import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "./config/types/interfaces/app-config.interface";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app')
  await app.listen(appConfig.port || 5000);

}
bootstrap();
