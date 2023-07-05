import { Test, TestingModule } from "@nestjs/testing";
import { RolesService } from "./roles.service";
import { TreeRepository } from "typeorm";
import { Role } from "./entities/role.entities";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";

describe("RolesService", () => {
  let rolesService: RolesService;
  let rolesRepository: TreeRepository<Role>;

  const ROLE_REPO_TOKEN = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: ROLE_REPO_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
    rolesRepository = module.get<TreeRepository<Role>>(ROLE_REPO_TOKEN);
  });

  it("rolesService should be defined", () => {
    expect(rolesService).toBeDefined();
  });

  it("rolesRepository should be defined", () => {
    expect(rolesRepository).toBeDefined();
  });

  it("create a new role", async () => {
    const data: CreateRoleDto = {
      name: "CEO",
      description: "boss and visionary of the company",
    };
    await rolesService.create(data);
    expect(rolesRepository.create).toHaveBeenCalledWith(data);
  });

  it("updates a role", async () => {
    jest.spyOn(rolesService, "findOne").mockImplementation(async () => ({
      id: "40647cab-1a21-4af9-92ff-996a0e59508d",
      name: "CEO",
      reportsTo: null,
      children: [],
      employees: [],
    }));

    await rolesService.update("40647cab-1a21-4af9-92ff-996a0e59508d", {
      description: "who doesn't dare to be a boss",
    });

    expect(rolesRepository.update).toHaveBeenLastCalledWith(
      "40647cab-1a21-4af9-92ff-996a0e59508d",
      {
        reportsTo: undefined,
        description: "who doesn't dare to be a boss",
      },
    );
  });

  it("delete a role", async () => {
    jest.spyOn(rolesService, "findOne").mockImplementation(async () => ({
      id: "40647cab-1a21-4af9-92ff-996a0e59508d",
      name: "CEO",
      reportsTo: null,
      children: [],
      employees: [],
    }));
    await rolesService.remove("40647cab-1a21-4af9-92ff-996a0e59508d");
    expect(rolesRepository.delete).toHaveBeenCalledWith(
      "40647cab-1a21-4af9-92ff-996a0e59508d",
    );
  });
});
