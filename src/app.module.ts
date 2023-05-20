import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenAiModule } from './modules/open-ai/open-ai.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'regtech',
      entities: ['./**/*.entity{.ts,.js}'],
      synchronize: false,
      migrationsRun: true,
      migrations: ['./migrations/**/*{.js,.ts}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
    }),
    OpenAiModule,
  ],
})
export class AppModule {}
