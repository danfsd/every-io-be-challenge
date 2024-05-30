import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { PrismaTaskRepository } from "../../../../../src/api/infrastructure/prisma/PrismaTaskRepository";
import { mockedPrismaClient } from "../../../../__mocks__/prisma/PrismaClientMock";
import { Task } from "@prisma/client";

describe("PrismaTaskRepository", () => {
  const prismaTaskRepository = new PrismaTaskRepository(mockedPrismaClient);
  const tasksAvailable: Task[] = [
    {
      id: "task-1",
      title: "Task 1",
      description: "Description Task 1",
      status: "TO_DO",
    },
  ];

  describe("when calling findAll", () => {
    const mockedFindMany = jest.spyOn(mockedPrismaClient.task, "findMany");
    let findAllResult: Task[];

    beforeEach(() => {
      mockedFindMany.mockResolvedValue(tasksAvailable);
    });

    describe("without status filter", () => {
      beforeEach(async () => {
        findAllResult = await prismaTaskRepository.findAll();
      });

      it("should return all tasks available", () => {
        expect(findAllResult).toHaveLength(1);
      });

      it("should call prisma's findMany exactly once", async () => {
        expect(mockedFindMany).toBeCalledTimes(1);
      });

      it("should call prisma's findMany with empty where object", async () => {
        expect(mockedFindMany).toBeCalledWith({ where: {} });
      });
    });

    describe("filtering by status", () => {
      beforeEach(async () => {
        findAllResult = await prismaTaskRepository.findAll("TO_DO");
      });

      it("should call prisma's findMany with status in where object", async () => {
        expect(mockedFindMany).toBeCalledWith({ where: { status: "TO_DO" } });
      });
    });
  });

  describe("when calling findOne", () => {
    const EXISTING_ID = "task-1";
    const mockedFindUnique = jest.spyOn(mockedPrismaClient.task, "findUnique");
    let findOneResult: Task | null;

    describe("when passing an ID from an existing Task", () => {
      let findOneResult: Task | null;
      beforeEach(async () => {
        mockedFindUnique.mockResolvedValue(tasksAvailable[0]);
        findOneResult = await prismaTaskRepository.findOne(EXISTING_ID);
      });

      it("should call prisma's findUnique exactly once", () => {
        expect(mockedFindUnique).toBeCalledTimes(1);
      });
      it("should call prisma's findUnique with where object containing ID", () => {
        expect(mockedFindUnique).toBeCalledWith({ where: { id: EXISTING_ID } });
      });
    });

    describe("when passing an inexisting ID", () => {
      const INEXISTING_ID = "task-2";

      let findOneResult: Task | null;
      beforeEach(async () => {
        mockedFindUnique.mockResolvedValue(null);
        findOneResult = await prismaTaskRepository.findOne(INEXISTING_ID);
      });

      it("should call prisma's findUnique exactly once", () => {
        expect(mockedFindUnique).toBeCalledTimes(1);
      });
      it("should call prisma's findUnique with where object containing ID", () => {
        expect(mockedFindUnique).toBeCalledWith({
          where: { id: INEXISTING_ID },
        });
      });
    });
  });

  describe("when calling create", () => {
    const mockedCreate = jest.spyOn(mockedPrismaClient.task, "create");
    let createResult: string;

    beforeEach(async () => {
      mockedCreate.mockResolvedValue({
        id: "new-task",
        title: "New Task",
        description: "New Description",
        status: "TO_DO",
      });
      createResult = await prismaTaskRepository.create(
        "New Task",
        "New Description",
        "TO_DO"
      );
    });

    it("should call prisma's create exactly once", () => {
      expect(mockedCreate).toBeCalledTimes(1);
    });

    it("should call prisma's create with task fields", () => {
      expect(mockedCreate).toBeCalledWith({
        data: {
          title: "New Task",
          description: "New Description",
          status: "TO_DO",
        },
        select: {
          id: true,
        },
      });
    });
  });

  describe("when calling patchStatus", () => {
    const NEW_STATUS = "IN_PROGRESS";
    const EXISTING_STATUS = "TO_DO";
    const EXISTING_ID = "task-1";
    const INEXISTING_ID = "task-2";

    const mockedFindUnique = jest.spyOn(mockedPrismaClient.task, "findUnique");
    const mockedUpdate = jest.spyOn(mockedPrismaClient.task, "update");

    describe("when Task exists", () => {
      describe("when statuses are different", () => {
        beforeEach(async () => {
          mockedFindUnique.mockResolvedValue(tasksAvailable[0]);
          await prismaTaskRepository.patchStatus(EXISTING_ID, NEW_STATUS);
        });

        it("should call prisma's findUnique exactly once", () => {
          expect(mockedFindUnique).toBeCalledTimes(1);
        });

        it("should call prisma's findUnique passing existing ID", () => {
          expect(mockedFindUnique).toBeCalledWith({
            where: { id: EXISTING_ID },
          });
        });

        it("should call prisma's update exactly once", () => {
          expect(mockedUpdate).toBeCalledTimes(1);
        });

        it("should call prisma's update passing existing ID and new status", () => {
          expect(mockedUpdate).toBeCalledWith({
            data: {
              status: NEW_STATUS,
            },
            where: {
              id: EXISTING_ID,
            },
          });
        });
      });

      describe("when statuses are the same", () => {
        beforeEach(async () => {
          mockedFindUnique.mockResolvedValue(tasksAvailable[0]);
          await prismaTaskRepository.patchStatus(EXISTING_ID, EXISTING_STATUS);
        });

        it("should call prisma's update exactly once", () => {
          expect(mockedUpdate).toBeCalledTimes(0);
        });
      });
    });

    describe("when Task does NOT exists", () => {
      beforeEach(async () => {
        mockedFindUnique.mockResolvedValue(null);
        await prismaTaskRepository.patchStatus(INEXISTING_ID, NEW_STATUS);
      });

      it("should call prisma's findUnique exactly once", () => {
        expect(mockedFindUnique).toBeCalledTimes(1);
      });

      it("should call prisma's update exactly once", () => {
        expect(mockedUpdate).toBeCalledTimes(0);
      });
    });
  });
});
