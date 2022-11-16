import { MigrationInterface, QueryRunner } from "typeorm";

export class createTransactionTable1668638293915 implements MigrationInterface {
    name = 'createTransactionTable1668638293915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "debited_account" uuid, "credited_account" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_aa5d87f79ffe600badebe63ca5e" FOREIGN KEY ("debited_account") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_646d6f5b3af493bc1f7a6d97b7f" FOREIGN KEY ("credited_account") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_646d6f5b3af493bc1f7a6d97b7f"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_aa5d87f79ffe600badebe63ca5e"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
