import { Module } from '@nestjs/common';

import { ProductModule } from 'src/product/product.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProductModule,
    AuthModule
  ],
})
export class SeedModule {}
