import { ApiPropertyOptional } from "@nestjs/swagger";

export class SearchTextDto {
  @ApiPropertyOptional({ default: "" })
  q: string;
}
export class PageDto {
  @ApiPropertyOptional({ default: 1 })
  page: number;
}
export class LimitDto {
  @ApiPropertyOptional({ default: 10 })
  limit: number;
}
