// Packages
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { EntityRepository } from '@mikro-orm/core';

// Database Entities
import { Test } from '../entities/Test.js';

// Utils
import { CustomError } from '../utils/error.js';
import { Logger } from '../utils/logger.js';

// Inversify Types
import { TYPES } from '../types/index.js';



@provide(TYPES.TEST_SERVICE)
export class TestService {

  constructor(

    @inject(TYPES.TEST_REPOSITORY)
    private testRepository: EntityRepository<Test>,

    @inject(TYPES.LOGGER)
    public readonly logger: Logger
  ) { }


  public getTest = async (): Promise<{ tests: Test[] } | void> => {
    try {
      return { tests: await this.testRepository.findAll() };
    } catch (error) {
      this.logger.error(error);
    }
  }

  public createTest = async (test: Test): Promise<{ message: string } | void> => {
    try {
      await this.testRepository.persistAndFlush(new Test(test.test));
      return { message: 'saved' };
    } catch (error) {
      this.logger.error(error);
      throw new CustomError('Can\'t save to database', 500);
    }
  }

}
