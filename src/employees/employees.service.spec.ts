import { Test, TestingModule } from "@nestjs/testing";
import { EmployeesService } from "./employees.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Employee, Gender } from "./entities/employee.entity";
import { Repository } from "typeorm";
import { RolesService } from "src/roles/roles.service";

describe("EmployeesService", () => {
  let service: EmployeesService;
  let rolesService: RolesService;
  let repo: Repository<Employee>;

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

  const role = {
    id: "xxx",
    name: "CEO",
    reportsTo: null,
    children: [],
    employees: [],
  };

  const EMP_REPO_TOKEN = getRepositoryToken(Employee);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: EMP_REPO_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
            preload: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    rolesService = module.get<RolesService>(RolesService);
    repo = module.get<Repository<Employee>>(EMP_REPO_TOKEN);
  });

  it("service should be defined", () => {
    expect(service).toBeDefined();
  });

  it("repository should be defined", () => {
    expect(repo).toBeDefined();
  });

  it("create employee", async () => {
    jest
      .spyOn(rolesService, "findOne")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation(async (_id: string) => role);
    await service.create(employee);
    expect(rolesService.findOne).toHaveBeenCalledWith(employee.roleId);
    expect(repo.create).toHaveBeenCalledWith({ ...employee, role });
  });

  it("countAll employees", async () => {
    await service.countAll();
    expect(repo.count).toHaveBeenCalled();
  });

  it("findAll employees", async () => {
    await service.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(repo.count).toHaveBeenCalled();
  });

  it("findOne employee", async () => {
    jest
      .spyOn(repo, "findOne")
      .mockImplementation(async () => ({ id: "xxx", role, ...employee }));
    await service.findOne("xxx");
    expect(repo.findOne).toHaveBeenCalled();
  });

  it("findOne employee returns error if not found", async () => {
    jest.spyOn(repo, "findOne").mockImplementation(async () => null);
    await expect(service.findOne("xxx")).rejects.toThrow();
  });

  it("update employee", async () => {
    const updates = { fullName: "New Name" };
    jest.spyOn(service, "findOne").mockReturnValue(Promise.resolve(null));
    await service.update("xxx", updates);
    expect(repo.update).toHaveBeenCalledWith("xxx", updates);
    expect(service.findOne).toHaveBeenCalled();
  });

  it("delete employee", async () => {
    await service.remove("xxx");
    expect(repo.delete).toHaveBeenCalledWith({ id: "xxx" });
  });
});
