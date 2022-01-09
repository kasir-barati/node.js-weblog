import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { webAppConfigsGenerator } from './configs/web-app.config';
import { winstonConfigsGenerator } from './configs/winston.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            load: [webAppConfigsGenerator, winstonConfigsGenerator],
        }),
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
