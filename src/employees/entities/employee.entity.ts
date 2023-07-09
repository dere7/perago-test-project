import { ApiProperty } from "@nestjs/swagger";
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
import { Role } from "../../roles/entities/role.entities";
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @IsPhoneNumber("ET")
  @Column({ unique: true })
  phone: string;

  @ApiProperty()
  @IsEnum(Gender)
  @Column({
    type: "enum",
    enum: Gender,
  })
  gender: Gender;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Column("date")
  birthDate: Date;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Column("date")
  hireDate: Date;

  @ApiProperty()
  @IsUUID()
  roleId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Column({ nullable: true })
  photo: string;

  @ManyToOne(() => Role, (role) => role.employees)
  role: Role;
}
