import pino from "pino";
import { APP_CONFIG } from "~/config/app.config";

const enablePrettyTransport = APP_CONFIG.isDevelopment && !APP_CONFIG.isTest;

const logger = pino({
  level: APP_CONFIG.logging.level,
  base: {
    service: "shopify-cod-form",
    environment: APP_CONFIG.environment,
  },
  transport: enablePrettyTransport
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

export type Logger = typeof logger;

export default logger;

