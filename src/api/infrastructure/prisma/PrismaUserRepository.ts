import { $Enums, PrismaClient, User, UserPermission } from "@prisma/client";
import { IUserRepository } from "../../domain/user/IUserRepository";
import bcrypt from "bcrypt";

export class PrismaUserRepository implements IUserRepository {
  constructor(private db: PrismaClient) {}

  async create(
    email: string,
    hashedPassword: string,
    permission: UserPermission
  ): Promise<Omit<User, "password">> {
    const result = await this.db.user.create({
      select: {
        id: true,
        email: true,
        password: false,
        permission: true,
      },
      data: {
        email,
        password: hashedPassword,
        permission,
      },
    });

    return result;
  }

  async findOne(id: string) {
    return this.db.user.findUnique({
      select: {
        id: true,
        email: true,
        password: false,
        permission: true,
      },
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }
}
