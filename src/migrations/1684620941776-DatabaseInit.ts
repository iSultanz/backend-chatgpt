import {MigrationInterface, QueryRunner} from "typeorm";

export class DatabaseInit1684620941776 implements MigrationInterface {
    name = 'DatabaseInit1684620941776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "regulations-Inquiry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recommended" text NOT NULL, "inquiry" text NOT NULL, "regulation" text NOT NULL, CONSTRAINT "PK_e525529147d4a3c62e18d40744c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "specialist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "embedding" numeric array NOT NULL, CONSTRAINT "PK_461a4a90df7daf980d8b79bc3ce" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "specialist"`);
        await queryRunner.query(`DROP TABLE "regulations-Inquiry"`);
    }

}
