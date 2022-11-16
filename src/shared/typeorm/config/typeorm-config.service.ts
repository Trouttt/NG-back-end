import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly database: string;
  private readonly entities: Array<string>;
  private readonly ssl: boolean;
  private readonly logging: boolean;

  constructor(
    private readonly configService: ConfigService<
      {
        NODE_ENV: string;
        DB_HOST: string;
        DB_PORT: number;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_DATABASE: string;
        DB_SSL: string;
        DB_LOGGING: string;
      },
      true
    >,
  ) {
    this.host = configService.get<string>('DB_HOST', {
      infer: true,
    });
    this.port = configService.get<number>('DB_PORT', {
      infer: true,
    });
    this.username = configService.get<string>('DB_USERNAME', {
      infer: true,
    });
    this.password = configService.get<string>('DB_PASSWORD', {
      infer: true,
    });
    this.database = configService.get<string>('DB_DATABASE', {
      infer: true,
    });
    this.entities = ['dist/src/modules/**/*.entity.js'];
    this.ssl =
      configService.get<string>('DB_SSL', {
        infer: true,
      }) === 'false'
        ? false
        : true;
    this.logging =
      configService.get<string>('DB_LOGGING', {
        infer: true,
      }) === 'false'
        ? false
        : true;
  }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const typeOrmModuleOptions: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      entities: this.entities,
      synchronize: false,
      ssl: this.ssl,
      logging: this.logging,
    };

    return typeOrmModuleOptions;
  }
}
