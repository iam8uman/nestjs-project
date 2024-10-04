import {
  ConflictException,
  HttpCode,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Create user
  async create(createUserDto: CreateUsersDto) {
    try {
      console.log('Creating user with data:', createUserDto);

      // Check if user with the given email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      // If user exists, throw ConflictException
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Create the new user
      const user = await this.prisma.user.create({
        data: createUserDto,
      });

      console.log('User created successfully:', user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);

      // Handle specific conflict exception
      if (error instanceof ConflictException) {
        throw error;
      }

      // General error handler
      throw new InternalServerErrorException(
        'Error creating user. Please try again later.',
      );
    }
  }

  // Find all users
  @HttpCode(201)
  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      console.log('Retrieved all users:', users);
      return users;
    } catch (error) {
      console.error('Error retrieving all users:', error);
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  // Find one user by ID
  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: Number(id) },
      });

      // If user doesn't exist, throw NotFoundException
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      console.log('Found user:', user);
      return user;
    } catch (error) {
      console.error(`Error finding user with ID ${id}:`, error);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Find one user by email (useful for login/auth)
  async findOneByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      // If user doesn't exist, return null
      if (!user) {
        console.log(`User with email ${email} not found`);
        return null;
      }

      console.log('Found user by email:', user);
      return user;
    } catch (error) {
      console.error(`Error finding user with email ${email}:`, error);
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }

  // Update user
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: Number(id) },
        data: updateUserDto,
      });

      console.log('Updated user:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);

      // If user doesn't exist, throw NotFoundException
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // General error handler
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  // Delete user
  async remove(id: number) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id: Number(id) },
      });

      console.log('Deleted user:', deletedUser);
      return deletedUser;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);

      // Handle user not found
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // General error handler
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
