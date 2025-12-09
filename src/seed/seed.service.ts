import { Injectable } from '@nestjs/common';
import { ProductService } from './../product/product.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private  readonly productService: ProductService,
  ) {}

  async executeSeed() {
    // Seed logic goes here
    await this.insertNewProducts();

    return 'Seeding executed';
  }

  private async insertNewProducts() {
    // Logic to insert new products
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises: Promise<any>[] = [];
    
    products.forEach( products => {
      insertPromises.push(this.productService.create(products));
    });

    await Promise.all( insertPromises );

    return true;
  }
}
