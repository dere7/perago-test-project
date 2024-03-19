import * as dotenv from "dotenv";
dotenv.config();
import { Role } from "./src/roles/entities/role.entity";
import { DataSource } from "typeorm";
import { Employee } from "./src/employees/entities/employee.entity";

const getAllUsers = async () => {
  const response = await fetch(
    "https://randomuser.me/api?page=1&results=20&seed=abc",
  );
  const data = await response.json();
  const employees = data.results.map((u) => ({
    fullName: u.name.first + " " + u.name.last,
    email: u.email,
    phone: u.phone,
    gender: u.gender === "female" ? "F" : "M",
    birthDate: u.dob.date,
    hireDate: u.registered.date,
    photo: u.picture.large,
  }));
  return employees;
};

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
  {
    name: "Tech Lead",
    reportsTo: "Product Owner",
    description:
      "A technical lead is a professional who oversees a team of technical personnel at a software or technology company",
  },
  {
    name: "Frontend Developer",
    reportsTo: "Tech Lead",
    description:
      "A front-end developer builds the front-end portion of websites and web applications—the part users see and interact with",
  },
  {
    name: "Backend Developer",
    reportsTo: "Tech Lead",
    description:
      "Back-end developers are the experts who build and maintain the mechanisms that process data and perform actions on websites",
  },
  {
    name: "DevOps Developer",
    reportsTo: "Tech Lead",
    description:
      "A DevOps engineer works with both the development and operations teams to create and implement software systems",
  },
  {
    name: "QA Engineer",
    reportsTo: "Product Owner",
    description:
      "A QA engineer creates tests that identify issues with software before a product launch.",
  },
  {
    name: "Scrum Master",
    reportsTo: "Product Owner",
    description:
      "A Scrum Master is a professional who leads a team using Agile project management through the course of a project",
  },
  {
    name: "Chief Accountant",
    reportsTo: "CFO",
    description:
      "Contribute to the preparation of the annual revenue and capital budgets, monitoring of financial performance and completion of the annual accounts.",
  },
  {
    name: "Internal Audit",
    reportsTo: "CFO",
    description:
      "Internal auditors examine and analyze company records and financial documents",
  },
  {
    name: "Financial Analyst",
    reportsTo: "Chief Accountant",
    description:
      "Financial analysts are responsible for a variety of research tasks to inform investment strategy and make investment decisions for their company or clients",
  },
  {
    name: "Product Manger",
    reportsTo: "COO",
    description:
      "A project manager is a professional who organizes, plans, and executes projects while working within restraints like budgets and schedules",
  },
  {
    name: "Operation Manger",
    reportsTo: "COO",
    description:
      "An operations manager is responsible for implementing and maintaining the processes that an organization uses",
  },
  {
    name: "Customer Relation",
    reportsTo: "COO",
    description:
      "Customer Relation handle the concerns of the people who buy their company's products or services",
  },
];

console.log(process.env["HOST"],process.env["PORT"], process.env["PASSWORD"], process.env["DB_USERNAME"], process.env["DATABASE"])

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env["HOST"] || "localhost",
  port: Number(process.env["PORT"]) || 5432,
  username: process.env["DB_USERNAME"],
  password: process.env["PASSWORD"],
  database: process.env["DATABASE"] || "orga_structure",
  synchronize: true,
  logging: true,
  entities: [Role, Employee],
  ssl: true,
});

async function main() {
  await AppDataSource.initialize();
  await AppDataSource.manager.delete(Employee, {});
  await AppDataSource.manager.delete(Role, {});
  const employees = await getAllUsers();
  for (let i = 0; i < data.length; i++) {
    const r = data[i];
    const e = employees[i];
    let reportsTo;
    if (r.reportsTo) {
      reportsTo = await AppDataSource.manager.findOneBy(Role, {
        name: r.reportsTo,
      });
    }
    const role = AppDataSource.manager.create(Role, {
      ...r,
      reportsTo,
    });
    const newRole = await AppDataSource.manager.save(role);
    const employee = AppDataSource.manager.create(Employee, {
      ...e,
      role: newRole,
    });
    await AppDataSource.manager.save(employee);
  }
  console.log("finished generating and saving test data");
}

main();
