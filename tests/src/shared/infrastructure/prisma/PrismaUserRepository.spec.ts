import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { mockedPrismaClient } from "../../../../__mocks__/prisma/PrismaClientMock";
import { PrismaUserRepository } from "../../../../../src/shared/infrastructure/prisma/PrismaUserRepository";
import { User } from "@prisma/client";

describe("PrismaTaskRepository", () => {
  const prismaUserRepository = new PrismaUserRepository(mockedPrismaClient);
  const usersAvailable: User[] = [
    {
      id: "user-1",
      email: "user1@email.com",
      password: "hashed-password",
      permission: "READ_WRITE",
    },
  ];

  describe("when calling findOne", () => {
    const mockedFindUnique = jest.spyOn(mockedPrismaClient.user, "findUnique");
    describe("when passing existing ID", () => {
      const EXISTING_ID = "user-1";

      let findOneResult: Omit<User, "password"> | null;

      beforeEach(async () => {
        mockedFindUnique.mockResolvedValue(usersAvailable[0]);
        findOneResult = await prismaUserRepository.findOne(EXISTING_ID);
      });

      it("should call prisma's findUnique exactly once", () => {
        expect(mockedFindUnique).toBeCalledTimes(1);
      });

      it("should call prisma's findUnique passing the ID", () => {
        expect(mockedFindUnique).toBeCalledWith({
          where: { id: EXISTING_ID },
          select: { id: true, email: true, password: false, permission: true },
        });
      });

      it("should return valid user", () => {
        expect(findOneResult?.id).toBe(EXISTING_ID);
      });
    });

    describe("when passing inexisting ID", () => {
      const INEXISTING_ID = "user-2";

      let findOneResult: Omit<User, "password"> | null;

      beforeEach(async () => {
        mockedFindUnique.mockResolvedValue(null);
        findOneResult = await prismaUserRepository.findOne(INEXISTING_ID);
      });

      it("should return valid user", () => {
        expect(findOneResult).toBeNull();
      });
    });
  });

  describe("when calling findOneByEmail", () => {
    const mockedFindUnique = jest.spyOn(mockedPrismaClient.user, "findUnique");

    describe("when passing existing email address", () => {
      const EXISTING_EMAIL = "user1@email.com";
      let findOneByEmailResult: User | null;

      beforeEach(async () => {
        mockedFindUnique.mockResolvedValue(usersAvailable[0]);
        findOneByEmailResult = await prismaUserRepository.findOneByEmail(
          EXISTING_EMAIL
        );
      });

      it("should call prisma's findUnique exactly once", () => {
        expect(mockedFindUnique).toBeCalledTimes(1);
      });

      it("should call prisma's findUnique passing the ID", () => {
        expect(mockedFindUnique).toBeCalledWith({
          where: { email: EXISTING_EMAIL },
        });
      });

      it("should return hashed password", () => {
        expect(findOneByEmailResult?.password).toBeTruthy();
      });

      it("should return valid user", () => {
        expect(findOneByEmailResult?.email).toBe(EXISTING_EMAIL);
      });
    });
  });

  describe("when calling create", () => {
    const mockedCreate = jest.spyOn(mockedPrismaClient.user, "create");

    let createResult: Omit<User, "password"> | null;
    beforeEach(async () => {
      mockedCreate.mockResolvedValue({
        id: "newuser",
        email: "newuser@email.com",
        password: "",
        permission: "READ",
      });
      createResult = await prismaUserRepository.create(
        "newuser@email.com",
        "hashed-password",
        "READ"
      );
    });

    it("should call prisma's create exactly once", () => {
      expect(mockedCreate).toBeCalledTimes(1);
    });

    it("should call prisma's create with user fields", () => {
      expect(mockedCreate).toBeCalledWith({
        select: {
          id: true,
          email: true,
          password: false,
          permission: true,
        },
        data: {
          email: "newuser@email.com",
          password: "hashed-password",
          permission: "READ",
        },
      });
    });
  });
});
