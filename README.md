# TP1 NestJS

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project Setup

```bash
$ npm install
```

## Development

```bash
# Run in development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Testing

```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Useful Packages

Install the following useful packages:

```bash
npm install @ngneat/falso jsonwebtoken @nestjs/platform-express multer
npm install -D @types/jsonwebtoken
npm install class-validator
<<<<<<< HEAD
npm install @nestjs/serve-static
=======
npm install @nestjs/passport passport passport-local
npm install @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
npm install @nestjs/config
npm install @nestjs/jwt

```

## Environment Variables

Make sure to define a `.env` file locally with all necessary database connection details and other environment-specific configuration.

Example `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASS=your_password
DB_NAME=your_db
JWT_SECRET=your_secret_key
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord](https://discord.gg/G7Qnnhy)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
