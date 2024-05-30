import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../api/domain/user/IUserRepository";
import ILogger from "../../domain/ILogger";
import { User } from "@prisma/client";
import { Configuration } from "../../../config";

export type VerifiedJwt = jwt.JwtPayload & { sub: string; permission: string };

export class AuthService {
  constructor(
    private logger: ILogger,
    private config: Configuration,
    private userRepository: IUserRepository
  ) {}

  public hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  private comparePassword(plain: string, hashed: string) {
    return bcrypt.compareSync(plain, hashed);
  }

  public generateJwt(user: Omit<User, "password">) {
    return jwt.sign(
      { sub: user.id, permission: user.permission },
      this.config.jwtSecret,
      { expiresIn: "1 hour" }
    );
  }

  public verifyJwt(userJwt: string) {
    try {
      const verifiedJwt = jwt.verify(
        userJwt,
        this.config.jwtSecret
      ) as VerifiedJwt;

      return verifiedJwt;
    } catch (error) {
      this.logger.error("Failed to verify JWT");
      return null;
    }
  }

  async authenticate(email: string, password: string) {
    this.logger.info(`Finding user with provided email...`);
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) return null;

    this.logger.info(`Validating provided password...`);
    const isValid = this.comparePassword(password, user.password);

    if (!isValid) return null;

    this.logger.info(`WIP: Generating JWT for User...`);

    return this.generateJwt(user);
  }
}
