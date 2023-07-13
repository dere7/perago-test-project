import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Employee } from "../../employees/entities/employee.entity";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";

@Entity()
@Tree("closure-table")
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({ length: 100 })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @Column("text", { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiHideProperty()
  @TreeParent({ onDelete: "CASCADE" })
  reportsTo: Role;

  @ApiHideProperty()
  @TreeChildren()
  children: Role[];

  @ApiProperty()
  @OneToMany(() => Employee, (employee) => employee.role, {
    onDelete: "CASCADE",
  })
  employees: Employee[];
}
