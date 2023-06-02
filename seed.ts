import { Role } from "./src/roles/entities/role.entities";
import { DataSource } from "typeorm";

type RoleData = {
  name: string;
  parent?: string;
};

const data: RoleData[] = [
  { name: "CEO" },
  { name: "CTO", parent: "CEO" },
  { name: "CFO", parent: "CEO" },
  { name: "COO", parent: "CEO" },
  { name: "HR", parent: "CEO" },
  {
    name: "Project Manager",
    parent: "CTO",
  },
  {
    name: "Product Owner",
    parent: "Project Manager",
  },
];

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "orga_structure",
  synchronize: true,
  logging: true,
  entities: [Role],
});

async function main() {
  await AppDataSource.initialize();
  for (const r of data) {
    const role = new Role();
    role.name = r.name;
    if (r.parent) {
      const parent = await AppDataSource.manager.findOneBy(Role, {
        name: r.parent,
      });
      role.parent = parent;
    }
    await AppDataSource.manager.save(role);
  }
  console.log("finished generating and saving test data");
}

main();
