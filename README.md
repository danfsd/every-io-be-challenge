# every-io-be-challenge

This repository contains every's backend challenge for candidate Daniel Sampaio.

## Requirements

- Docker
- Docker Compose

## Project

### Libraries Used

- Typescript
- Express.js for handling HTTP requests and routing
- [Prisma ORM](https://www.prisma.io/orm)
- [Apollo Server for GraphQL](https://www.apollographql.com/docs/apollo-server/)
- [Pino](https://github.com/pinojs/pino-http) for logging

### Setup

#### Environment Variables

Please create a new `.env` file using the contents of `.env.example`.

#### Running project

To execute the project, first you need to spin up the database container by running:

```sh
# Starts database container as daemon
docker compose up -d database
```

Then, simply run the command below to start the Backend app:

```sh
# Starts Backend app in the foreground
docker compose up backend
```

Alternatively, you can run the Backend app in the host machine by running

```sh
# Install 3rd-party dependencies
npm install
# Starts the Backend app in the host machine
npm run dev
```

### Troubleshooting

#### `Prisma Client could not locate the Query Engine for runtime`

If you see this message, most likely you ran the Backend app on the host machine and then attempted to run it on the Docker container.

If that's the case, I recommend you to:

1. prune `node_modules` from the host machine
2. rebuild the `backend` container

To do that, simply run:

```sh
# Remove node_modules directory from your host machine
rm -rf node_modules
# Start Backend container asking Docker to rebuild the image from scratch
docker compose up --build backend
```
