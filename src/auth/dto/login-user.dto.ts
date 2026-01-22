import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com'
    })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'StrongP@ssw0rd'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
} 