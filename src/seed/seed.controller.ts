import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ summary: 'Execute database seed with initial data' })
  @ApiResponse({ status: 200, description: 'Seed executed successfully. Database populated with initial data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  executeSeed() {
    return this.seedService.executeSeed();
  }
}