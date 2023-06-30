import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { RolesService } from "src/roles/roles.service";
import { Role } from "src/roles/entities/role.entities";

describe("Roles E2E", () => {
  let app: INestApplication;
  let rolesService: RolesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    rolesService = app.get(RolesService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /roles", () => {
    return request(app.getHttpServer())
      .get("/roles")
      .expect(200)
      .expect(/^\[[\s\S]*?\]$/); // returns array
  });

  describe("POST /roles", () => {
    it("create a role if valid data is provided", () => {
      return request(app.getHttpServer())
        .post("/roles")
        .send({
          name: "CEO",
          description: "creates mission and purpose statements",
        })
        .expect(201)
        .expect(/CEO/);
    });

    it("returns 400 if invalid name(e.g. if not provided) is provided", () => {
      return request(app.getHttpServer())
        .post("/roles")
        .send({
          description: "creates mission and purpose statements",
        })
        .expect(400)
        .expect(/name/)
        .expect(/error/);
    });

    it("returns 400 if invalid description(e.g. if it is not string) is provided", () => {
      return request(app.getHttpServer())
        .post("/roles")
        .send({
          name: "CEO",
          description: 343534,
        })
        .expect(400)
        .expect(/description/)
        .expect(/error/);
    });

    it("returns 400 if invalid parentId(e.g. if it is not a number) is provided", () => {
      return request(app.getHttpServer())
        .post("/roles")
        .send({
          name: "CTO",
          description:
            "manages the physical and personnel technology infrastructure",
          parentId: "xdd3",
        })
        .expect(400)
        .expect(/parentId/)
        .expect(/error/);
    });
  });

  describe("With some role data", () => {
    let cto: Role, ceo: Role, frontend: Role;
    beforeAll(async () => {
      const rolesService = app.get(RolesService);
      ceo = await rolesService.create({
        name: "CEO",
      });
      cto = await rolesService.create({
        name: "CTO",
        parentId: ceo.id,
      });
      await rolesService.create({
        name: "Backend Developer",
        parentId: cto.id,
      });
      frontend = await rolesService.create({
        name: "Frontend Developer",
        parentId: cto.id,
      });
    });

    describe("GET /roles/:id", () => {
      it("for existing role should return 200", async () => {
        return request(app.getHttpServer())
          .get(`/roles/${cto.id}`)
          .expect(200)
          .expect(/CTO/)
          .expect(/^\{[\s\S]*?\}$/); // returns array
      });

      it("for non-existing role should return 404", async () => {
        return request(app.getHttpServer())
          .get(`/roles/3453435`)
          .expect(404)
          .expect(/error/)
          .expect(/Not Found/);
      });
    });

    describe("PATCH /roles/:id", () => {
      it("should update a role if it exists and valid data is provided", () => {
        return request(app.getHttpServer())
          .patch(`/roles/${cto.id}`)
          .send({
            description:
              "manages the physical and personnel technology infrastructure",
          })
          .expect(200)
          .expect(/technology infrastructure/);
      });

      it("should return 404 if the role doesn't exist", () => {
        return request(app.getHttpServer())
          .patch("/roles/3353533")
          .expect(404)
          .expect(/Not Found/);
      });

      it("should return 400 if the id isn't valid", () => {
        return request(app.getHttpServer())
          .patch("/roles/d3d")
          .expect(400)
          .expect(/Bad Request/);
      });

      it("should return 400 if the body isn't valid", () => {
        return request(app.getHttpServer())
          .patch(`/roles/${cto.id}`)
          .send({ description: 43343 }) // invalid! description must be a string
          .expect(400)
          .expect(/Bad Request/);
      });
    });

    describe("DELETE /roles/:id", () => {
      it("should return 204", () => {
        return request(app.getHttpServer())
          .delete(`/roles/${frontend.id}`)
          .expect(204);
      });

      it("should update roles parent from deleted role to its parent", async () => {
        await request(app.getHttpServer()).delete(`/roles/${cto.id}`);
        ceo = await rolesService.findOne(ceo.id);
        expect(ceo.children[0]?.name).toBe("Backend Developer");
      });

      it("should return 400 if the id isn't valid", () => {
        return request(app.getHttpServer())
          .delete("/roles/d3d")
          .expect(400)
          .expect(/Bad Request/);
      });
    });
  });
});
