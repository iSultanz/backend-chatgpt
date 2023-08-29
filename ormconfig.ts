import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();
export = {
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'regtech',

  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  autoLoadEntities: true,
  migrations: ['src/migrations/*{.js,.ts}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
    //           migrationsDir: 'src/db/migrations'
  },
  extra: {
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  },
};
