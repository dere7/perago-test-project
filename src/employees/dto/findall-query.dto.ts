import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class EmployeeFindAllQueryDto {
  q?: string = "";
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  page?: number = 1;
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  limit?: number = 10;
}
