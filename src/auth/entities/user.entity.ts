import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsArray, IsEmail, IsNotEmpty } from "class-validator";
import { Product } from "src/product/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @ApiProperty({
        description: 'User ID',
        example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com'
    })
    @Column('text', { 
        unique: true 
    })
    email: string;

    @ApiProperty({  
        description: 'User password',
        example: 'StrongP@ssw0rd'
    })
    @Column('text',{
        select: false
    })
    password: string;

    @ApiProperty({
        description: 'Full name of the user',
        example: 'John Doe'
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        description: 'Indicates if the user is active',
        example: true
    })
    @Column('bool', { 
        default: true 
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Roles assigned to the user',
        example: ['user', 'admin'],
    })
    @Column('text', { 
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        product => product.user
    )
    @IsArray()
    products: Product[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
