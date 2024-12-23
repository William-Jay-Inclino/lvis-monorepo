import { PipeTransform, Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Express } from 'express';
import { MAX_FILE_SIZE } from '../config';

@Injectable()
export class FileValidationPipe implements PipeTransform {
    private readonly logger = new Logger(FileValidationPipe.name); 

    transform(value: any) {
        if (!value || typeof value !== 'object' || !value.mimetype || !value.size) {
            this.logger.error('File not uploaded or invalid file object');
            throw new BadRequestException('File not uploaded or invalid file object');
        }

        this.logger.log('Validating file:', value.originalname);  

        // Validate the file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!allowedMimeTypes.includes(value.mimetype)) {
            this.logger.error(`Invalid file type: ${value.mimetype}`);
            throw new BadRequestException('Invalid file type');
        }

        this.logger.log('File type is valid:', value.mimetype);  

        // Validate the file size
        if (value.size > MAX_FILE_SIZE) {
            this.logger.error(`File is too large. Size: ${value.size}, Maximum allowed: ${MAX_FILE_SIZE}`);
            throw new BadRequestException(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        }

        this.logger.log(`File is within size limit: ${value.size} bytes`);

        return value;
    }
}
