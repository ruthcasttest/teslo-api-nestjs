import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  @ApiOperation({ summary: 'Get product image by filename' })
  @ApiResponse({ status: 200, description: 'Image retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid image name.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    
    const path = this.filesService.getStaticProductImage( imageName );

    // res.status(403).json({
    //   ok: false,
    //   path
    // });

    res.sendFile( path );
    // return path;
  }

  @Post('product')
  @ApiOperation({ summary: 'Upload a product image' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully. Returns secure URL.' })
  @ApiResponse({ status: 400, description: 'Bad Request. File not provided or invalid file type.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1024 * 1024 * 5 } // 5MB
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    })
  }))
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File
  ) {

    if ( !file ) {
      throw new BadRequestException('File not provided');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    console.log(file);
    return {  secureUrl  };
  }

}
