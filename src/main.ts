import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { corsConfigsGenerator } from './configs/cors.config';
import { helmetConfigsGenerator } from './configs/helmet.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const { corsConfigs } = corsConfigsGenerator();
    const { helmetConfigs } = helmetConfigsGenerator();

    app.enableCors(corsConfigs);
    app.use(helmet(helmetConfigs));
    await app.listen(3000);
}
bootstrap();
