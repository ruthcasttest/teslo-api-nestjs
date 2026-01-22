import { IsAlphanumeric, IsArray, IsEmail, IsNotEmpty } from "class-validator";
import { Product } from "src/product/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { 
        unique: true 
    })
    email: string;

    @Column('text',{
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', { 
        default: true 
    })
    isActive: boolean;

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
