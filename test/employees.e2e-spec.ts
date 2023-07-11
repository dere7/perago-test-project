import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { RolesService } from "src/roles/roles.service";
import { Role } from "src/roles/entities/role.entities";
import { EmployeesService } from "src/employees/employees.service";
import { Gender } from "src/employees/entities/employee.entity";

describe("Roles E2E", () => {
  let app: INestApplication;
  let rolesService: RolesService;
  let employeesService: EmployeesService;
  const employee = {
    fullName: "Abebe Tesfu",
    email: "abebe123@perago.com",
    phone: "0987334423",
    gender: Gender.Male,
    birthDate: new Date("2000-03-05T11:51:06.753Z"),
    hireDate: new Date("2020-07-05T11:51:06.753Z"),
    roleId: "d1f323e2-a611-4f49-8297-4f9911d4f266",
    photo: "https://robohash.org/hicveldicta.png?size=50x50&set=set1",
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    rolesService = app.get(RolesService);
    employeesService = app.get(EmployeesService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /employees", () => {
    return request(app.getHttpServer())
      .get("/employees")
      .expect(200)
      .expect(/page/)
      .expect(/limit/)
      .expect(/result/)
      .expect(/^\{[\s\S]*?\}$/); // returns array
  });

  describe("POST /employees", () => {
    it("create a employee if valid data is provided", () => {
      return request(app.getHttpServer())
        .post("/employees")
        .send(employee)
        .expect(201)
        .expect(/Abebe Tesfu/);
    });
  });
});
