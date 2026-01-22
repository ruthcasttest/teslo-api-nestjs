import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user =this.userRespository.create( {
        ...userData,
        password: bcrypt.hashSync( password, 10 ),
      } );

      await this.userRespository.save( user );
      
      return {
        ...user,
        token: this.getJwtToken( { id: user.id } )
      };

    } catch (error) {
      this.handleDbErrors( error );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRespository.findOne( { 
      where: { email },
      select: { id: true, email: true, password: true, isActive: true }
    } );  

    if ( !user )
    throw new UnauthorizedException('Credentials are not valid (email)');

    if( !user.isActive ) throw new UnauthorizedException('User is inactive');

    if(bcrypt.compareSync( password, user.password ) === false )
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user
      , token: this.getJwtToken( { id: user.id } )
    };
  }

  async checkAuthStatus( user: User ) {
    
    return {
      ...user,
      token: this.getJwtToken( { id: user.id } )
    };
  } 

  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDbErrors( error: any ): never {
    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );
    
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
