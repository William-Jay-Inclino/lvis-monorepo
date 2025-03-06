import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as WinstonDailyRotateFile from 'winston-daily-rotate-file';
import { format, toZonedTime } from 'date-fns-tz';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private readonly logger: winston.Logger;

    constructor() {
        const timeZone = process.env.TZ || 'Asia/Manila';

        this.logger = winston.createLogger({
            level: 'info', // Default log level
            format: winston.format.combine(
                winston.format.timestamp({
                    format: () => {
                        const now = new Date();
                        const zonedDate = toZonedTime(now, timeZone);
                        return format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone });
                    },
                }),
                winston.format.printf(
                    ({ timestamp, level, message, context }) =>
                        `${timestamp},${level.toUpperCase()},${message},${context || 'N/A'}`
                )
            ),
            transports: [
                // Log to a CSV file with daily rotation
                new WinstonDailyRotateFile({
                    filename: 'logs/combined-%DATE%.csv',
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20m',
                }),
                // Error logs in a separate CSV file
                new WinstonDailyRotateFile({
                    level: 'error',
                    filename: 'logs/error-%DATE%.csv',
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20m',
                }),
            ],
        });

        this.logger.info('Winston logger initialized successfully');
    }

    log(message: string, context?: any) {

        // Helper function to recursively handle nested objects and flatten them
        const formatContext = (obj: any): string => {
            let output = '';
            Object.keys(obj).forEach(key => {
                const value = obj[key];

                // If value is a stringified JSON, parse it and recursively format it
                if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
                    try {
                        const parsedValue = JSON.parse(value);  // Try to parse stringified JSON
                        output += `${key}=${formatContext(parsedValue)} `;
                    } catch {
                        // If JSON parsing fails, treat it as a normal string
                        output += `${key}=${value} `;
                    }
                } else if (typeof value === 'object' && value !== null) {
                    // Recursively handle nested objects
                    output += `${key}=${formatContext(value)} `;
                } else {
                    // If value is a primitive (string, number, etc.), log it directly
                    output += `${key}=${value} `;
                }
            });
            return output.trim();
        };

        // Format the message object into a string
        const formattedContext = typeof context === 'string' ? context : formatContext(context)

        // Log the formatted message to Winston
        this.logger.info(message, { context: formattedContext });
    }

    // log(message: any, context?: string) {

    //     if(typeof message === 'string') {
    //         this.logger.info(message, { context });
    //         return
    //     }

    //     // Helper function to recursively handle nested objects and flatten them
    //     const formatMessage = (obj: any): string => {
    //         let output = '';
    //         Object.keys(obj).forEach(key => {
    //             const value = obj[key];

    //             // If value is a stringified JSON, parse it and recursively format it
    //             if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    //                 try {
    //                     const parsedValue = JSON.parse(value);  // Try to parse stringified JSON
    //                     output += `${key}=${formatMessage(parsedValue)} `;
    //                 } catch {
    //                     // If JSON parsing fails, treat it as a normal string
    //                     output += `${key}=${value} `;
    //                 }
    //             } else if (typeof value === 'object' && value !== null) {
    //                 // Recursively handle nested objects
    //                 output += `${key}=${formatMessage(value)} `;
    //             } else {
    //                 // If value is a primitive (string, number, etc.), log it directly
    //                 output += `${key}=${value} `;
    //             }
    //         });
    //         return output.trim();
    //     };

    //     // Format the message object into a string
    //     const formattedMessage = formatMessage(message);

    //     // Log the formatted message to Winston
    //     this.logger.info(formattedMessage, { context });
    // }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(`${message}${trace ? ` - Trace: ${trace}` : ''},${context || 'N/A'}`);
    }

    warn(message: string, context?: string) {
        this.logger.warn(`${message},${context || 'N/A'}`);
    }

    debug(message: string, context?: string) {
        this.logger.debug(`${message},${context || 'N/A'}`);
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(`${message},${context || 'N/A'}`);
    }
}
