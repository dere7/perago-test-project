import { Test, TestingModule } from "@nestjs/testing";
import { RolesService } from "./roles.service";
import { TreeRepository } from "typeorm";
import { Role } from "./entities/role.entities";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { ForbiddenException } from "@nestjs/common";

describe("RolesService", () => {
  let rolesService: RolesService;
  let rolesRepository: TreeRepository<Role>;

  const data: CreateRoleDto = {
    name: "CEO",
    description: "boss and visionary of the company",
  };

  const ceoData: Role = {
    ...data,
    id: "xxx-xxx",
    reportsTo: null,
    employees: [],
    children: [],
  };

  const responseData = {
    ...ceoData,
    children: [
      {
        id: "xxx",
        name: "CTO",
        reportsTo: {
          id: ceoData.id,
          name: "CEO",
          children: [],
          reportsTo: null,
          employees: [],
        },
        employees: [],
        children: [],
      },
    ],
  };

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
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findTrees: jest.fn(),
            findDescendants: jest.fn(async (role) => role.children),
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

  describe("create role", () => {
    it("without parent(root role)", async () => {
      await rolesService.create(data);
      expect(rolesRepository.create).toHaveBeenCalledWith({
        ...data,
        reportsTo: null,
      });
      expect(rolesRepository.save).toHaveBeenCalled();
    });

    it("with parent", async () => {
      const data: CreateRoleDto = {
        name: "CTO",
        description: "belongs to where the real work is done",
        parentId: ceoData.id,
      };

      jest.spyOn(rolesService, "findOne").mockImplementation(async (id) => ({
        ...ceoData,
        id,
      }));

      await rolesService.create(data);
      expect(rolesRepository.create).toHaveBeenCalledWith({
        name: data.name,
        description: data.description,
        reportsTo: ceoData,
      });
      expect(rolesRepository.save).toHaveBeenCalled();
    });
  });

  describe("findAll roles", () => {
    it("when isFlat is set to true", async () => {
      await rolesService.findAll(true);
      expect(rolesRepository.find).toBeCalled();
    });

    it("when isFlat is set to false", async () => {
      await rolesService.findAll();
      expect(rolesRepository.findTrees).toBeCalled();
    });
  });
  describe("with mock findOne", () => {
    beforeEach(() => {
      jest.spyOn(rolesService, "findOne").mockImplementation(async (id) => ({
        ...responseData,
        id,
      }));
    });

    it("findAllDescendants of a role", async () => {
      jest
        .spyOn(rolesService, "findOne")
        .mockImplementation(async (id) => ({ ...responseData, id }));
      await rolesService.findAllDescendants("xxx");
      expect(rolesRepository.findDescendants).toHaveBeenCalled();
    });

    describe("isDescendent", () => {
      it("returns true if second role is descendant of first one", async () => {
        const result = await rolesService.isDescendant(responseData.id, "xxx");
        expect(result).toBe(true);
      });

      it("returns false if second role is not descendant of first one", async () => {
        const result = await rolesService.isDescendant(ceoData.id, "yyy");
        expect(result).toBe(false);
      });
    });
  });

  describe("update a role", () => {
    beforeEach(() => {
      jest.spyOn(rolesService, "findOne").mockImplementation(async (id) => ({
        ...ceoData,
        id,
      }));
    });

    it("should call update and findOne(twice) if new parentId is not included in body", async () => {
      await rolesService.update("40647cab", {
        description: "who doesn't dare to be a boss",
      });

      expect(rolesRepository.update).toHaveBeenCalledWith("40647cab", {
        description: "who doesn't dare to be a boss",
      });
      expect(rolesService.findOne).toHaveBeenCalledTimes(2);
    });

    it("should call update if new parentId is included in body and is not descendant", async () => {
      jest
        .spyOn(rolesService, "isDescendant")
        .mockReturnValue(Promise.resolve(false));
      await rolesService.update("40647cab", {
        parentId: ceoData.id,
        description: "who doesn't dare to be a boss",
      });

      expect(rolesRepository.update).toHaveBeenCalledWith("40647cab", {
        description: "who doesn't dare to be a boss",
        reportsTo: ceoData,
      });
    });

    it("should throw error if the new parent is descendant", async () => {
      jest
        .spyOn(rolesService, "isDescendant")
        .mockReturnValue(Promise.resolve(true));
      const result = rolesService.update("40647cab", {
        parentId: ceoData.id,
        description: "who doesn't dare to be a boss",
      });

      expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("delete a role", () => {
    it("if it has no children", async () => {
      jest.spyOn(rolesService, "findOne").mockImplementation(async (id) => ({
        ...ceoData,
        id,
      }));
      await rolesService.remove("40647cab", {});
      expect(rolesRepository.delete).toHaveBeenCalledWith("40647cab");
    });

    describe("if it has children", () => {
      beforeEach(() => {
        jest.spyOn(rolesService, "findOne").mockImplementation(async (id) => ({
          ...responseData,
          id,
        }));
      });

      it("should throw error if parentId is not provided", async () => {
        const result = rolesService.remove(responseData.id, {});
        expect(result).rejects.toBeInstanceOf(ForbiddenException);
      });

      it("should throw error if the new parent is descendant", async () => {
        jest
          .spyOn(rolesService, "isDescendant")
          .mockReturnValue(Promise.resolve(true));
        const result = rolesService.remove(responseData.id, {
          parentId: "xxx",
        });
        expect(result).rejects.toBeInstanceOf(ForbiddenException);
      });

      it("should delete a role if the new parent is not descendant", async () => {
        jest
          .spyOn(rolesService, "isDescendant")
          .mockReturnValue(Promise.resolve(false));
        await rolesService.remove(responseData.id, {
          parentId: "xxx",
        });
        expect(rolesRepository.delete).toBeCalled();
      });
    });
  });
});
