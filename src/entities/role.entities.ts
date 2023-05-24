import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  name: string;
  @Column("text")
  description: string;
  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Role, (role) => role.children)
  @JoinColumn()
  parent: Role;

  @OneToMany(() => Role, (role) => role.parent)
  @JoinColumn()
  children: Role[];
}
