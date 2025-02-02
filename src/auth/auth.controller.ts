// auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.authService.validateUser(userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.authService.logout(userId);
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validate(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.authService.validateUser(userId);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    const userId = req.user['userId']; // Extracting userId from the JWT
    return this.authService.getUserDetails(userId);
  }
}
