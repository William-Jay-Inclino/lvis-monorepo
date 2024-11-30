// file-upload.controller.ts

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { SingleFileTypeValidationPipe } from './pipes/single-file-type-validation.pipe';
import { MAX_FILE_SIZE, EMPLOYEE_UPLOAD_PATH } from '../__common__/config';
import { FileUploadSystemService } from './file-upload-system.service';

@Controller('/api/v1/file-upload/system')
export class FileUploadSystemController {

    private readonly logger = new Logger(FileUploadSystemController.name);

    constructor(private readonly fileUploadService: FileUploadSystemService) { }

    @Get('/employee/:filename')
    async getSingleFileEmployee(@Param('filename') filename: string, @Res() res: Response) {
        try {
            const destination = EMPLOYEE_UPLOAD_PATH;
            const fileExists = await this.fileUploadService.checkFileExists(filename, destination);
    
            if (!fileExists) {
                return (res as any).status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    data: `File ${filename} not found`
                });
            }
    
            const filePath = await this.fileUploadService.getFilePath(filename, destination);
            return (res as any).sendFile(filePath);
        } catch (error) {
            this.logger.error('Error retrieving single file:', error.message);
            return (res as any).status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                data: `Failed to retrieve file: ${error.message}`
            });
        }
    }

    @Post('/employee/single')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingleFileEmployee(
        @UploadedFile(new SingleFileTypeValidationPipe(MAX_FILE_SIZE)) file: Express.Multer.File,
    ) {
        try {
            const destination = EMPLOYEE_UPLOAD_PATH;
            const savedFilePath = await this.fileUploadService.saveFileLocally(file, destination);
            this.logger.log('File saved at:', savedFilePath);
            return { success: true, data: savedFilePath };
        } catch (error) {
            this.logger.error('Error uploading single file:', error.message);
            throw new HttpException({ success: false, data: `Failed to upload single file: ${error.message}` }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('/employee/:filename')
    async deleteSingleFileEmployee(@Param('filename') filename: string) {
        try {
            const destination = EMPLOYEE_UPLOAD_PATH;
            await this.fileUploadService.deleteFileLocally(filename, destination);
            this.logger.log('File deleted:', filename);
            return { success: true, data: `File deleted: ${filename}` };
        } catch (error) {
            this.logger.error('Error deleting single file:', error.message);
            throw new HttpException({ success: false, data: `Failed to delete single file: ${error.message}` }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('/employee')
    async deleteMultipleFilesEmployee(@Body() filePaths: string[]) {

        try {
            const destination = EMPLOYEE_UPLOAD_PATH;
            const deletePromises = filePaths.map(filePath => {

                const parts = filePath.split('/');
                const filename = parts[parts.length - 1];

                this.fileUploadService.deleteFileLocally(filename, destination)

            });
            await Promise.all(deletePromises);
            this.logger.log('Files deleted:', filePaths);
            return { success: true, data: `Files deleted: ${filePaths.join(', ')}` };
        } catch (error) {
            this.logger.error('Error deleting files:', error.message);
            throw new HttpException({ success: false, data: `Failed to delete multiple file: ${error.message}` }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
