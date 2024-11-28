import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as WinstonDailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info', // Default log level
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, context }) =>
            `${timestamp} [${level}]: ${message} - Context: ${context || 'N/A'}`
        )
      ),
      transports: [
        // Log to a file with daily rotation in JSON format
        new WinstonDailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint({ colorize: false }) // Formats JSON nicely with indentation
          ),
        }),
        // Error logs in a separate file with JSON format
        new WinstonDailyRotateFile({
          level: 'error',
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint({ colorize: false }) // Formats JSON nicely
          ),
        }),
      ],
    });

    this.logger.info('Winston logger initialized successfully');
  }

  log(message: any) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error({ message, trace });
  }

  warn(message: string) {
    this.logger.warn({ message });
  }

  debug(message: string) {
    this.logger.debug({ message });
  }

  verbose(message: string) {
    this.logger.verbose({ message });
  }
}
