import bcrypt from "bcrypt";
import { IUserRepository } from "../../../api/domain/user/IUserRepository";
import { AuthService } from "../auth/AuthService";

export class UserService {
  constructor(
    private authService: AuthService,
    private userRepository: IUserRepository
  ) {}

  async createUser(email: string, password: string, permission: string) {
    return this.userRepository.create(
      email,
      this.authService.hashPassword(password),
      permission
    );
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }
}
