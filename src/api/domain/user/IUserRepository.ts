import { User } from "@prisma/client";

export interface IUserRepository {
  create(
    email: string,
    password: string,
    permission: string
  ): Promise<Omit<User, "password">>;
  findOne(id: string): Promise<Omit<User, "password"> | null>;
  findOneByEmail(email: string): Promise<User | null>;
}
