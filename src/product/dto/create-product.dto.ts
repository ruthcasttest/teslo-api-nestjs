import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'Title of the product',
        example: 'T-Shirt Teslo'
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 0.00,
        default: 0
    })
    @IsNumber()
    @IsPositive()   
    @IsOptional()
    price?: number;
    
    @ApiProperty({
        description: 'Description of the product',
        example: 'This is a sample product description',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({
        description: 'Slug of the product for SEO',
        example: 't_shirt_teslo',
        required: false
    })
    @IsString()
    @IsOptional()
    slug?: string;
    
    @ApiProperty({
        description: 'Stock quantity of the product',
        example: 10,
        default: 0
    })
    @IsInt()
    @IsOptional()
    stock?: number;
    
    @ApiProperty({
        description: 'Available sizes for the product',
        example: ['S', 'M', 'L', 'XL']
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];
    
    @ApiProperty({
        description: 'Gender category for the product',
        example: 'men',
        enum: ['men', 'women', 'kid', 'unisex']
    })
    @IsString()
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        description: 'Tags associated with the product',
        example: ['shirt', 'summer', 'cotton'],
        required: false
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        description: 'Images of the product',
        example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
        required: false
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
