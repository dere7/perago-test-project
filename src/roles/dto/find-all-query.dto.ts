import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class FindAllQueryDto {
  @IsBoolean()
  @Transform(({ value }) => (value && value === "true" ? true : false))
  flat?: boolean = false;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value && Number(value))
  depth?: number = 10;
}

export class PaginationQueryDto {
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  limit?: number = 10;
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  page?: number = 1;
}
