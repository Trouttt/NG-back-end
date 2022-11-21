<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://
## Description

Foi utilizado NEST. Pra rodar é necessário ter o docker instalado, criar uma imagem do postgreSQL e fazer ter uma env parecida com essa, ex:
```
NODE_ENV=development

NEST_API_PORT=3012

SECURITY_SALT=20

DB_CONNECTION=postgres

DB_HOST=localhost

DB_USERNAME=postgres

DB_PASSWORD=tiktok@123

DB_DATABASE=NG

DB_PORT=5432

DB_SYNC=false

DB_SSL=false

DB_LOGGING=info
```

## Installation

```bash
yarn
```

## Running the app

yarn start:dev

```

## License

Nest is [MIT licensed](LICENSE).
