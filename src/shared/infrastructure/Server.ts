import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import express from "express";
import * as http from "http";

import { Configuration } from "../../config";
import ServerLogger from "./logger";

export default class ApplicationServer {
  private readonly express: express.Application;
  private apolloServer?: ApolloServer;
  private http?: http.Server;

  constructor(
    private router: express.Router,
    private logger: ServerLogger,
    private config: Configuration
  ) {
    this.express = express();
    this.express.use(this.router);
  }

  public async start() {
    return new Promise<void>(async (resolve) => {
      const httpServer = http.createServer(this.express);

      this.logger.info("Creating Apollo Server instance...");

      // TODO: improve typedef loading from separate file using graphql-tools

      const apolloServer = new ApolloServer({
        typeDefs: `
          type TasksQueryResult {
            success: Boolean
          }

          type Query {
            tasks: TasksQueryResult
          }
        `,
        resolvers: [
          // TODO: Add resolvers
        ],
        introspection: this.config.nodeEnv === "development",
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      });
      this.logger.info("Starting Apollo Server...");
      await apolloServer.start();

      this.http = httpServer;
      this.apolloServer = apolloServer;

      this.logger.info("Creating Apollo endpoint...");
      this.express.use(
        "/graphql",
        cors<cors.CorsRequest>(),
        express.json(),
        // TODO: add authentication middleware
        expressMiddleware(apolloServer, {
          context: async (context) => ({
            request: context.req,
            response: context.res,
          }),
        })
      );

      this.logger.info("Starting Express app...");
      this.express.listen(this.config.applicationPort, () => {
        this.logger.info(
          `Express app is running on PORT ${this.config.applicationPort}`
        );

        resolve();
      });
    });
  }

  public async stop() {
    this.logger.info("Stopping Apollo Server...");
    await this.apolloServer?.stop();
    this.logger.info("Stopping HTTP Server...");
    await this.http?.close();

    this.http = undefined;
    this.apolloServer = undefined;
  }
}
