import {MigrationInterface, QueryRunner} from "typeorm";

export class addingUserCustomerRelation1637243656036 implements MigrationInterface {
    name = 'addingUserCustomerRelation1637243656036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" character varying(255) NOT NULL, "customerId" integer, CONSTRAINT "REL_6c687a8fa35b0ae35ce766b56c" UNIQUE ("customerId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "lastName" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "phone" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6c687a8fa35b0ae35ce766b56ce" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6c687a8fa35b0ae35ce766b56ce"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
