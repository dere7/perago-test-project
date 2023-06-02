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

  @ApiProperty()
  @Column("text", { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiHideProperty()
  @TreeParent({ onDelete: "CASCADE" })
  parent: Role;

  @ApiHideProperty()
  @TreeChildren()
  children: Role[];
}
