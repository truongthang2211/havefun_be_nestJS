import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private UserService: UsersService) {}
  @Post('signin')
  UserSignIn(@Body() user) {
    return this.UserService.UserSignIn(user);
  }
  @Post('signup')
  UserSignUp(@Body() user) {
    return this.UserService.UserSignUp(user);
  }

  @Post('hostsignin')
  HostUserSignIn(@Body() user) {
    return this.UserService.HostUserSignIn(user);
  }
  @Post('hostsignup')
  HostUserSignUp(@Body() user) {
    return this.UserService.HostUserSignUp(user);
  }
}
