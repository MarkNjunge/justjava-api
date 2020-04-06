import {MigrationInterface, QueryRunner} from "typeorm";

export class createNotificationsTable1586186713588 implements MigrationInterface {
    name = 'createNotificationsTable1586186713588'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "token" character varying NOT NULL, "reason" character varying NOT NULL, "message" character varying NOT NULL, "extra" character varying NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "notifications"`, undefined);
    }

}
