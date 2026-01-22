import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from "../entities";
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        description: 'Product ID',
        example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        name: 'Title',
        description: 'Product title',
        example: 'T-Shirt Teslo'
    })
    @Column('text', { 
        unique: true 
    })
    title: string;

    @ApiProperty({
        description: 'Product price',
        example: 0.00
    })
    @Column('float', { 
        default: 0 
    })
    price: number

    @ApiProperty({
        description: 'Product description',
        example: 'This is a sample product description'
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({
        description: 'Product slug for SEO',
        example: 't_shirt_teslo'
    })
    @Column('text', { 
        unique: true 
    })
    slug: string;

    @ApiProperty({
        description: 'Product stock',
        example: 10
    })
    @Column('int', { 
        default: 0 
    })
    stock: number;

    @ApiProperty({
        description: 'Product sizes',
        example: ['S', 'M', 'L', 'XL']
    })
    @Column('text', { 
        array: true,
        default: []
    })
    sizes: string[];

    @ApiProperty({
        description: 'Product gender',
        example: ['men', 'women', 'kid', 'unisex'],
    })
    @Column('text', { 
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(
        () => ProductImage, 
        (productImage) => productImage.product, {
        cascade: true,
        eager: true,
    })
    images?: ProductImage[];

    @ManyToOne(
        () => User, 
        (user) => user.products, {
        eager: true,
    })
    user: User;

    @Column('text')
    gender: string;

    @BeforeInsert()
    checkSlugInsert() {
        if( !this.slug){
            this.slug = this.title
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '');
        }
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if( !this.slug){
            this.slug = this.title
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '');
        }
    }
}
