import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class FindAllQueryDto {
  flat?: boolean = false;
  depth?: number = Infinity;
}

export class PaginationQueryDto {
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  limit?: number = 10;
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  page?: number = 1;
}
