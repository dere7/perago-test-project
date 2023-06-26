import { Test, TestingModule } from "@nestjs/testing";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { Role } from "./entities/role.entities";

describe("RolesController", () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it("findAll", async () => {
    const role = new Role();
    role.name = "CEO";
    const result = [role];
    jest.spyOn(service, "findAll").mockImplementation(async () => result);
    expect(await controller.findAll()).toBe(result);
  });
});
