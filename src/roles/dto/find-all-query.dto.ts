import { ApiPropertyOptional } from "@nestjs/swagger";

export class FlatQueryDto {
  @ApiPropertyOptional({ default: false })
  flat: boolean;
}

export class DepthQueryDto {
  @ApiPropertyOptional({ default: Infinity })
  depth: number;
}
