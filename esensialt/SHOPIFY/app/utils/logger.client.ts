import { APP_CONFIG } from "~/config/app.config";

type LogLevel = "debug" | "info" | "warn" | "error";

const levels: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const currentLevel = APP_CONFIG.logging.level as LogLevel;

function shouldLog(level: LogLevel) {
  return levels[level] >= levels[currentLevel];
}

function formatPrefix(level: LogLevel) {
  return `[CODFORM][${level.toUpperCase()}]`;
}

const clientLogger = {
  debug: (...args: unknown[]) => {
    if (APP_CONFIG.isDevelopment && shouldLog("debug")) {
      console.debug(formatPrefix("debug"), ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (shouldLog("info")) {
      console.info(formatPrefix("info"), ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (shouldLog("warn")) {
      console.warn(formatPrefix("warn"), ...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(formatPrefix("error"), ...args);
  },
};

export type ClientLogger = typeof clientLogger;

export default clientLogger;


