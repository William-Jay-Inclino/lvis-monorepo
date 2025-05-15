import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { MAX_FILE_SIZE } from '../config';

@Injectable()
export class MultipleFileValidationPipe implements PipeTransform {


    // transform(files: Express.Multer.File[]) {
    //     if (!Array.isArray(files) || files.length === 0) {
    //         throw new BadRequestException('No files uploaded');
    //     }

    //     files.forEach((file) => {
    //         // Validate file type
    //         const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    //         if (!allowedMimeTypes.includes(file.mimetype)) {
    //             throw new BadRequestException(`Invalid file type: ${file.originalname}`);
    //         }

    //         // Validate file size
    //         if (file.size > MAX_FILE_SIZE) {
    //             throw new BadRequestException(`File ${file.originalname} is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    //         }
    //     });

    //     return files;
    // }

    transform(files: Express.Multer.File[]) {
        if (!Array.isArray(files) || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        files.forEach((file) => {
            // Validate file type
            const allowedMimeTypes = [
                'image/jpeg', 
                'image/png',  
                'image/gif', 
                'image/jpg',
                'application/pdf',
                'application/x-pdf'
            ];
            
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new BadRequestException(
                    `Invalid file type: ${file.originalname}. Allowed types: images (JPEG, PNG, GIF, JPG) and PDF`
                );
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                throw new BadRequestException(
                    `File ${file.originalname} is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
                );
            }
        });

        return files;
    }

}
