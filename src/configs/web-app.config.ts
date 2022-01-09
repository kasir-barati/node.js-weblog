import { NodeEnv, webAppConfigs } from '../contracts/types/web.type';

export function webAppConfigsGenerator():
    | { webAppConfigs: webAppConfigs }
    | never {
    const webAppConfigs = {
        webAppConfigs: {
            nodeEnv:
                (process.env?.NODE_ENV as NodeEnv) ??
                NodeEnv.development,
            sa: {
                username: process.env?.SA_USERNAME,
                password: process.env?.SA_PASSWORD,
            },
            host: process.env?.APP_HOST ?? 'localhost',
            port: Number(process.env?.APP_PORT) ?? 3000,
            exposedPort:
                Number(process.env?.APP_EXPOSED_PORT) ?? 5000,
            swaggerRoute: process.env.SWAGGER_ROUTE,
        },
    };
    return webAppConfigs;
}
