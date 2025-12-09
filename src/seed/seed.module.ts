import { Module } from '@nestjs/common';

import { ProductModule } from 'src/product/product.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProductModule
  ],
})
export class SeedModule {}
