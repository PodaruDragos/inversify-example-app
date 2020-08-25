// Packages
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Test {
  @PrimaryKey()
  public id!: number;

  @Property()
  public test: string


  constructor(
    test: string
  ) {
    this.test = test;
  }

}