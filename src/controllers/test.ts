// Packages
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';

// Services
import { TestService } from '../services/test.js';

// Database Entities
import { Test } from '../entities/Test.js';

// Utils
import { Logger } from '../utils/logger.js';

// Inversify Types
import { TYPES } from '../types/index.js';



@controller('/test')
export class TestController {
  constructor(
    @inject(TYPES.TEST_SERVICE)
    private readonly testService: TestService,

    @inject(TYPES.LOGGER)
    private readonly logger: Logger
  ) { }


  @httpGet('/')
  public async getTest(
    _request: Request,
    response: Response,
    next: NextFunction
  ): Promise<{ tests: Test[] } | void> {
    try {
      const result = await this.testService.getTest();
      response.json(result);
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(next(error));
    }
  }

  @httpPost('/')
  public async createTest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<{ tests: Test[] } | void> {
    try {
      const result = await this.testService.createTest(request.body);
      response.json(result);
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(next(error));
    }
  }

}
