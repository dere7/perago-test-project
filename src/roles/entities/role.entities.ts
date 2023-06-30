import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";

@Entity()
@Tree("materialized-path")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 100 })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: "optional description of the role's responsibility",
  })
  @Column("text", { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    description:
      "parents role id to whom the current role reports to. It is optional in the case of the topmost role(e.g. CEO)",
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiHideProperty()
  @TreeParent({ onDelete: "CASCADE" })
  reportsTo: Role;

  @ApiHideProperty()
  @TreeChildren()
  children: Role[];
}
