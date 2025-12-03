import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  
  @IsOptional()
  @IsPositive()
  @Type( () => Number ) //enabledImplicitConversion: true <--- No seria necesario si se habilita en main.ts
  readonly limit?: number;

  @IsOptional()
  @Min(0) 
  @Type( () => Number ) //enabledImplicitConversion: true <--- No seria necesario si se habilita en main.ts
  readonly offset?: number;

}