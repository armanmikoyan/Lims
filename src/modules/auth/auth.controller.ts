import { Controller, Delete, Get, HttpStatus, Inject, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AUTH_SERVICE_TOKEN } from './auth.service';
import { LoginGuard } from 'src/modules/auth/guards/login.guard';
import { Request, Response } from 'express';
import { RefreshToken, Tokens } from '../security/interfaces/token.interface';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginErrorResponseDto, LoginSuccessResponseDto } from './dto/login.dto';
import { UserPayload } from '../user/interfaces/userEntity.interface';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { RefreshTokenSuccessResponseDto } from './dto/refreshToken.dto';
import { AuthGuard } from './guards/auth.guard';
import { LogoutErrorResponseDto, LogoutSuccessResponseDto } from './dto/logout.dto';
import { ForbiddenErrorDto } from 'src/common/dtos/forbidden.dto';
import { IAuthService } from './interfaces/authService.interface';
import { TokenErrorResponseDto } from '../security/dto/token.dto';

const ROUTE = 'auth';

@ApiTags(ROUTE)
@Controller(ROUTE)
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  @Inject(AUTH_SERVICE_TOKEN) private authService: IAuthService;

  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, type: LoginSuccessResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: LoginErrorResponseDto })
  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`[${this.login.name}] - Method start`);
    try {
      const user: UserPayload = (req as any).user as UserPayload;
      const tokens: Tokens = await this.authService.login(user);
      res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });

      this.logger.log(`[${this.login.name}] - Method finished`);
      return res.status(200).json({ access_token: tokens.access_token });
    } catch (error) {
      this.logger.error(`[${this.login.name}] - Exception thrown` + error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: TokenErrorResponseDto })
  @ApiResponse({ status: HttpStatus.OK, type: LogoutSuccessResponseDto })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ForbiddenErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: LogoutErrorResponseDto })
  @UseGuards(AuthGuard)
  @Delete('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`[${this.logout.name}] - Method start`);
    const user: UserPayload | null = (req as any).user as UserPayload;
    try {
      if (user) {
        await this.authService.logout(user, null);
      } else {
        const refresh_token: RefreshToken = req.cookies['refresh_token'];
        if (refresh_token) {
          await this.authService.logout(null, refresh_token);
        }
      }
      res.clearCookie('refresh_token', { httpOnly: true });
      this.logger.log(`[${this.logout.name}] - Method finished`);
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      this.logger.error(`[${this.logout.name}] - Exception thrown` + error);
      throw error;
    }
  }

  @ApiCookieAuth()
  @ApiResponse({ status: HttpStatus.OK, type: RefreshTokenSuccessResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: TokenErrorResponseDto })
  @UseGuards(RefreshTokenGuard)
  @Get('refreshAccessToken')
  async refreshAccessToken(@Req() req: Request) {
    const user: UserPayload = (req as any).user as UserPayload;
    return {
      access_token: await this.authService.refreshAccessToken(user),
    };
  }
}
