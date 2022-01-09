import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

// All general configs for RESTful API
import { corsConfigsGenerator } from './configs/cors.config';
import { helmetConfigsGenerator } from './configs/helmet.config';
import { webAppConfigs } from './contracts/types/web.type';

// All Middleware
import { csrfMiddlewareError } from './commons/middlewares/errors/csrf.middleware';
import { csrfMiddleware } from './commons/middlewares/generals/csrf.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const { corsConfigs } = corsConfigsGenerator();
    const { helmetConfigs } = helmetConfigsGenerator();
    const configService = app.get(ConfigService);
    const appConfigs =
        configService.get<webAppConfigs>('webAppConfigs');

    app.use(cookieParser());
    app.use(
        csurf({
            cookie: { sameSite: true },
            value: (req) => req.cookies['XSRF-TOKEN'],
        }),
    );
    app.use(csrfMiddleware);
    app.use(csrfMiddlewareError);
    app.enableCors(corsConfigs);
    app.use(helmet(helmetConfigs));

    await app.listen(appConfigs.port);
}
bootstrap();
