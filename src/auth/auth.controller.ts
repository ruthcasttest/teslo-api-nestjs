import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { IncomingHttpHeaders } from 'http';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto, LoginUserDto } from './dto'
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@ApiBearerAuth('bearer-token')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody( { type: CreateUserDto } )
  @ApiResponse({ status: 201, description: 'User was created.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 201, description: 'User was created.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody( { type: LoginUserDto } )
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({ status: 201, description: 'User authentication status checked.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid credentials.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus( user );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  @ApiOperation({ summary: 'Test private route with authentication' })
  @ApiResponse({ status: 200, description: 'Private route accessed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid token required.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  testingPrivateRoute(
    // @Req() request: Express.Request,
    @GetUser() user: User,
    // @GetUser('email') user: User
    // @RawHeaders() rawHeaders: string[]
    @Headers() headers: IncomingHttpHeaders
  ) {
    // console.log( { request } );
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      // RawHeaders,
      headers
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards( AuthGuard(), UserRoleGuard )
  @ApiOperation({ summary: 'Test private route with admin/superUser role protection' })
  @ApiResponse({ status: 200, description: 'Private route accessed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid token required.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin or SuperUser role required.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  testingPrivateRoute2(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  @ApiOperation({ summary: 'Test private route with Auth decorator' })
  @ApiResponse({ status: 200, description: 'Private route accessed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid token required.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin or SuperUser role required.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  testingPrivateRoute3(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user,
    }
  }
}
