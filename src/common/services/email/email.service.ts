import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ResetToken } from 'src/modules/security/interfaces/token.interface';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.getOrThrow<string>('EMAIL_USER'),
        pass: this.configService.getOrThrow<string>('EMAIL_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: ResetToken) {
    const url = `${this.configService.getOrThrow<string>('EMAIL_RESET_PASSWORD_URL')}?reset_token=${token}`;
    const mailOptions = {
      to: email,
      subject: 'Password reset',
      html: `<h4> You requested password reset</h4> <p> Click the link below to reset you password: </p> <p><a href="${url}">Reset Password</a></p>`,
    };
    this.logger.log('Email with reset link is sent to ', email);
    await this.transporter.sendMail(mailOptions);
  }

  async sendTempPasswordEmail(email: string, password: string) {
    const mailOptions = {
      to: email,
      subject: 'Password reset',
      html: `<h4> Your temporary password</h4> <p> Use this temporary password to log in, and create a new password: </p> <p><strong>${password}</strong></p>`,
    };
    this.logger.log('Email with temporary password is sent to ', email);
    await this.transporter.sendMail(mailOptions);
  }
}
