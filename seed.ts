import * as dotenv from "dotenv";
dotenv.config();
import { Role } from "./src/roles/entities/role.entities";
import { DataSource } from "typeorm";

type RoleData = {
  name: string;
  reportsTo?: string;
  description?: string;
};

const data: RoleData[] = [
  {
    name: "CEO",
    description:
      "Chief Executive Officer (CEO) creates the mission and purpose statements and sets the standards for business operations",
  },
  {
    name: "CTO",
    reportsTo: "CEO",
    description:
      "Chief Technology Officer(CTO) manages the physical and personnel technology infrastructure including technology deployment, network and system management, integration testing, and developing technical operations personnel",
  },
  {
    name: "CFO",
    reportsTo: "CEO",
    description:
      "Chief Financial Officer(CFO) is responsible for managing the company's financial operations and strategy",
  },
  {
    name: "COO",
    reportsTo: "CEO",
    description:
      "Chief Operating Officer(COO) oversees day-to-day operations and executes the company's long-term goals",
  },
  {
    name: "HR",
    reportsTo: "CEO",
    description:
      "Human resources (HR) is responsible for finding, recruiting, screening, and training job applicants business responsible for finding, recruiting, screening, and training job applicants",
  },
  {
    name: "Project Manager",
    reportsTo: "CTO",
    description:
      "Project Manager is organizes, plans, and executes projects while working within constraints like budgets and schedules.",
  },
  {
    name: "Product Owner",
    reportsTo: "Project Manager",
    description:
      "The project owner is typically the head of the business unit that proposed the project or is the recipient of the project output or product.",
  },
];

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env["HOST"] || "localhost",
  port: Number(process.env["PORT"]) || 5432,
  username: process.env["DB_USERNAME"],
  password: process.env["PASSWORD"],
  database: process.env["DATABASE"] || "orga_structure",
  synchronize: true,
  logging: true,
  entities: [Role],
});

async function main() {
  await AppDataSource.initialize();
  for (const r of data) {
    const role = new Role();
    role.name = r.name;
    role.description = r.description;
    if (r.reportsTo) {
      const parent = await AppDataSource.manager.findOneBy(Role, {
        name: r.reportsTo,
      });
      role.reportsTo = parent;
    }
    await AppDataSource.manager.save(role);
  }
  console.log("finished generating and saving test data");
}

main();
