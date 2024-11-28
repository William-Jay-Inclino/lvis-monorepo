import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UPLOADS_PATH } from '../__common__/config';

@Injectable()
export class FileUploadService {

    private readonly logger = new Logger(FileUploadService.name);


    async getFilePath(filename: string, destination: string): Promise<string | null> {
        const filePath = path.resolve(UPLOADS_PATH, destination, filename);
    
        try {
            // Check if the file exists asynchronously
            await fs.promises.access(filePath, fs.constants.F_OK);
            return filePath; // File exists, return the file path
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Handle the case where the file does not exist (ENOENT: Error NO ENTry)
                this.logger.error(`File not found: ${filename}`);
            } else {
                // Handle other errors (e.g., permission issues, file system errors)
                this.logger.error(`Error checking file existence: ${filename} - ${error.message}`);
            }
    
            // Return null if file doesn't exist or an error occurred
            return null;
        }
    }

    async saveFileLocally(file: Express.Multer.File, destination: string): Promise<string | null> {
        const uploadDir = path.join(UPLOADS_PATH, destination); // Specify your desired upload directory
    
        try {
            // Create the uploads directory and its parent directories if they don't exist
            await fs.promises.mkdir(uploadDir, { recursive: true });
    
            // Generate a unique filename
            const uniqueFilename = Date.now() + '_' + file.originalname;
    
            // Construct the full path to save the file
            const filePath = path.join(uploadDir, uniqueFilename);
    
            // Write the file to the local storage asynchronously
            await fs.promises.writeFile(filePath, file.buffer);
    
            // Return the path to the saved file
            return filePath;
    
        } catch (error) {
            // Log the error and handle gracefully without crashing the server
            console.error(`Error saving file ${file.originalname} to ${uploadDir}: ${error.message}`);
    
            // Return null in case of error, signaling failure without throwing an unhandled exception
            return null;
        }
    }


    async saveFilesLocally(files: Express.Multer.File[], destination: string): Promise<string[]> {
        const savedFilePaths: string[] = [];

        for (const file of files) {
            const filePath = await this.saveFileLocally(file, destination);
            savedFilePaths.push(filePath);
        }

        return savedFilePaths;
    }

    async deleteFileLocally(filename: string, destination: string): Promise<void> {
        if (!filename || filename.trim() === '') {
            // If the filename is empty or undefined, just return without doing anything.
            return;
        }
    
        const filePath = path.join('uploads', destination, filename);
    
        try {
            // Check if the file exists asynchronously
            await fs.promises.access(filePath, fs.constants.F_OK);
            
            // File exists, so proceed with deletion
            await fs.promises.unlink(filePath);
            console.log(`File deleted: ${filePath}`);
    
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Handle the case where the file does not exist (ENOENT: Error NO ENTry)
                console.warn(`File not found: ${filePath}`);
            } else {
                // For other types of errors (e.g., permission issues), log the error and prevent server crash
                console.error(`Error deleting file ${filePath}: ${error.message}`);
                throw new Error(`Failed to delete file: ${error.message}`);
            }
        }
    }

    async deleteFilesLocally(filenames: string[], destination: string): Promise<void> {
        for (const filename of filenames) {
            await this.deleteFileLocally(filename, destination);
        }
    }

    async checkFileExists(filename: string, directory: string): Promise<boolean> {
        const filePath = path.join('uploads', directory, filename);
    
        try {
          // Check if the file exists at the specified path
          await fs.promises.access(filePath, fs.constants.F_OK);
          return true; // File exists
        } catch (error) {
          this.logger.error(`File ${filename} does not exist at ${directory}:`, error.message);
          return false; // File does not exist
        }
    }

}
