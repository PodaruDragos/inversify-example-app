// Packages
import { inject, injectable } from 'inversify';
import { EntityManager } from '@mikro-orm/postgresql';

// Database Entities
import { Test } from '../entities/Test.js';

// Utils
import { CustomError } from '../utils/error.util.js';
import { Logger } from '../utils/logger.util.js';

// Inversify Types
import { TYPES } from '../types/index.js';



@injectable()
export class TestService {

  constructor(
    @inject(TYPES.ENTITY_MANAGER)
    private entityManager: EntityManager,

    @inject(TYPES.LOGGER)
    public readonly logger: Logger
  ) { }


  public getTest = async (): Promise<{ tests: Test[] }> => {
    try {
      return { tests: await this.entityManager.find(Test, {}) };
    } catch (error) {
      this.logger.error(error);
      throw new CustomError('Can\'t get from database', 500);
    }
  };

  public createTest = async (test: Test): Promise<{ message: string }> => {
    try {
      await this.entityManager.persistAndFlush(new Test(test.test));
      return { message: 'saved' };
    } catch (error) {
      this.logger.error(error);
      throw new CustomError('Can\'t save to database', 500);
    }
  };

}
