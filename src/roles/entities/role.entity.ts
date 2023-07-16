import { ApiHideProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsOptional, IsString } from "class-validator";
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

  @Column({ length: 100 })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column("text", { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * It is optional in the case of the topmost role(e.g. CEO)
   */
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiHideProperty()
  @TreeParent({ onDelete: "CASCADE" })
  reportsTo: Role;

  @ApiHideProperty()
  @TreeChildren()
  children: Role[];

  @OneToMany(() => Employee, (employee) => employee.role, {
    onDelete: "CASCADE",
  })
  employees: Employee[];
}
