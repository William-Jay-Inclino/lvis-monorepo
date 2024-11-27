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
          ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`,
        ),
      ),
      transports: [
        // Log to console
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        // Log to a file with daily rotation (no automatic deletion)
        new WinstonDailyRotateFile({
          filename: 'logs/combined-%DATE%.log', // Logs will be rotated daily
          datePattern: 'YYYY-MM-DD', // Date format for daily logs
          maxSize: '20m', // Maximum size before rotating (e.g., 20MB)
          // Do not set `maxFiles`, so the log files will not be automatically deleted
        }),
        // Separate file for error logs with daily rotation (no automatic deletion)
        new WinstonDailyRotateFile({
          level: 'error',
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          // Do not set `maxFiles`, so the log files will not be automatically deleted
        }),
      ],
    });

    this.logger.info('Winston logger initialized successfully');
    
  }

  log(message: string, ctxt: any) {
    this.logger.info(`${message} - Context: ${ctxt}`);
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - Trace: ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
