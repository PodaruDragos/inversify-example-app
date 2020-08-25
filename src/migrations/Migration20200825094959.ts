import { Migration } from '@mikro-orm/migrations';

export class Migration20200825094959 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "test" ("id" serial primary key, "test" varchar(255) not null);');
  }

}
