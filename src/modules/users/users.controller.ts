import { Controller, Get, Post, UsePipes, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidationPipe } from '../../core/pipes';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAll() {
    return this.userService.findAll();
  }
  
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }
}
