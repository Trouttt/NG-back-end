import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

let migrationsDir: string;

if (process.env.NODE_ENV !== 'production') {
  migrationsDir = 'src/shared/typeorm/migrations/*';
} else {
  migrationsDir = 'dist/src/shared/typeorm/migrations/*';
}

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: [migrationsDir],
  entities: ['dist/src/modules/**/*.entity.js'],
  synchronize: false,
};

export const dataSource: DataSource = new DataSource(dataSourceOptions);
