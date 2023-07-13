import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { RolesService } from "src/roles/roles.service";
import { EmployeesService } from "src/employees/employees.service";
import { Gender } from "src/employees/entities/employee.entity";

describe("Roles E2E", () => {
  let app: INestApplication;
  let rolesService: RolesService;
  let employeesService: EmployeesService;

  const random = Math.floor(Math.random() * 1000);
  const employee = {
    fullName: "Abebe Tesfu",
    email: random + "abebe123@perago.com",
    phone: "0987334" + random,
    gender: Gender.Male,
    birthDate: new Date("2000-03-05T11:51:06.753Z"),
    hireDate: new Date("2020-07-05T11:51:06.753Z"),
    photo: "https://robohash.org/hicveldicta.png?size=50x50&set=set1",
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
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
    it("create a employee if valid data is provided", async () => {
      const role = await rolesService.create({
        name: "CEO",
      });

      return request(app.getHttpServer())
        .post("/employees")
        .send({ ...employee, roleId: role.id })
        .expect(201)
        .expect(/Abebe Tesfu/);
    });
  });
});
