import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from '../entities/user.entity';
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecretKey',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate( payload: JwtPayload ): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id  });

        if ( !user ) throw new UnauthorizedException('Token not valid - User does not exists');

        if( !user.isActive ) throw new UnauthorizedException('Token not valid - User is inactive');

        return user;
    }


}