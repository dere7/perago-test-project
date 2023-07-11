import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
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
  @IsUUID()
  @IsOptional()
  parentId?: string;

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
