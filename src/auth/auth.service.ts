import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// import { TokenService } from 'src/utils/deleteToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // User registration logic
  async register(registerAuthDto: RegisterDto) {
    const { email, password, name } = registerAuthDto;
    console.log(`Registering user with email: ${email}`);

    try {
      // Check if the user already exists
      console.log('Checking if user already exists...');
      const existingUser = await this.userService.findOneByEmail(email);

      if (existingUser) {
        console.log('User already exists');
        throw new ConflictException('Email already exists');
      }

      // If the user doesn't exist, proceed with registration
      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user in the database
      console.log('Creating user in the database...');
      const user = await this.userService.create({
        email,
        password: hashedPassword,
        name,
      });

      // Return success response
      console.log('User registered successfully');
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      console.error('Error during registration:', error);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  // User login logic
  async login(loginAuthDto: LoginDto) {
    const { email, password } = loginAuthDto;
    console.log(`Attempting to log in user with email: ${email}`);

    try {
      // Find user by email
      console.log('Finding user by email...');
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        console.log('User not found');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Compare passwords
      console.log('Comparing passwords...');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Create JWT payload and sign token
      console.log('Creating JWT payload and signing token...');
      const payload = { id: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      console.log('Login successful');
      return {
        access_token: accessToken,
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // Validate the user by ID
  async validateUser(userId: number) {
    console.log(`Validating user with ID: ${userId}`);
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        console.log(`User with ID ${userId} not found`);
        throw new UnauthorizedException('Invalid user ID');
      }
      console.log('User validated successfully');
      return user;
    } catch (error) {
      console.error('Error during user validation:', error);
      throw new UnauthorizedException('Invalid user ID');
    }
  }

  // Refresh the access token using the refresh token
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.validateUser(payload.sub);

      // Create new access token
      const newPayload = { sub: user.id, email: user.email };
      const newAccessToken = this.jwtService.sign(newPayload);

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      console.error('Error during token refresh:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  //  logout the user
  // Logout the user by deleting the access token and clearing session data
  async logout(userId: number) {
    console.log(`Logging out user with ID: ${userId}`);
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        console.log(`User with ID ${userId} not found`);
        throw new UnauthorizedException('Invalid user ID');
      }

      // Delete the access token and clear session data
      console.log('Deleting access token and clearing session data...');
      // await this.TokenService.deleteAccessToken(userId);
      await this.clearSessionData(userId);

      console.log('User logged out successfully');
      return {
        message: 'User logged out successfully',
      };
    } catch (error) {
      console.error('Error during user logout:', error);
      throw new UnauthorizedException('Invalid user ID');
    }
  }

  // Placeholder method for clearing session data
  private async clearSessionData(userId: number) {
    // Implement session data clearing logic here
    console.log(`Session data for user ID ${userId} cleared`);
  }

  async getUserDetails(userId: number) {
    try {
      const user = await this.userService.findOne(userId); // Fetch user from database
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return user; // Return user details
    } catch (error) {
      console.error('Error retrieving user details:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException
      }
      throw new InternalServerErrorException('Failed to retrieve user details');
    }
  }
}
