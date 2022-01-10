import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';

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
        WinstonModule.forRootAsync({
            useFactory: async (
                configService: ConfigService,
            ): Promise<winston.LoggerOptions> => ({
                ...configService.get<winston.LoggerOptions>(
                    'loggerOptions',
                ),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
