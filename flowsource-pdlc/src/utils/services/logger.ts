import { DEFAULT_LOG_LEVEL } from "../../constants/common";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const getLogger = (fileName = "mainui") => {
  const fileLogTransport = new DailyRotateFile({
    filename: `logs/${fileName}-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
  });
  const consoleTransport = new transports.Console({
    level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
    handleExceptions: false,
    format: format.printf((i) => `${i.message}`),
  });

  const logger = createLogger({
    level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(
        ({ level, message, timestamp }) =>
          `${timestamp} ${level}: ${message}`
      )
    ),
    defaultMeta: { service: "my-app" },
    transports: [consoleTransport],
  });

  logger.add(fileLogTransport);

  return logger;
};

export default getLogger();
