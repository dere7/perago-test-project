import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from "class-validator";
import { Role } from "../../roles/entities/role.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Transform } from "class-transformer";

export enum Gender {
  Male = "M",
  Female = "F",
}

@Entity()
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  fullName: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsPhoneNumber("ET")
  @Column({ unique: true })
  phone: string;

  @IsEnum(Gender)
  @Column({
    type: "enum",
    enum: Gender,
  })
  gender: Gender;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Column("date")
  birthDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Column("date")
  hireDate: Date;

  @IsUUID()
  roleId: string;

  @IsOptional()
  @Column({ nullable: true })
  photo?: string;

  @ManyToOne(() => Role, (role) => role.employees)
  role: Role;
}
