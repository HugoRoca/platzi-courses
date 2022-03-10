import {MigrationInterface, QueryRunner} from "typeorm";

export class dateAt1646798864922 implements MigrationInterface {
    name = 'dateAt1646798864922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_6c687a8fa35b0ae35ce766b56ce" UNIQUE ("customerId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "registerCreateat" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "registerUpdateat" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "registerCreateat" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "registerUpdateat" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6c687a8fa35b0ae35ce766b56ce" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6c687a8fa35b0ae35ce766b56ce"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "registerUpdateat"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "registerCreateat"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registerUpdateat"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registerCreateat"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_6c687a8fa35b0ae35ce766b56ce"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "customerId"`);
    }

}