import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MessagingService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SYSTEM_EMAIL, 
        pass: process.env.SYSTEM_PASS, 
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<{ success: boolean, msg: string }> {

    try {
      const mailOptions = {
        from: process.env.SYSTEM_EMAIL, 
        to,
        subject,
        text: body, // Use `html: body` if sending HTML content
      };

      await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        msg: 'Email sent successfully'
      }

    } catch (error) {
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
