// Packages
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';

// Services
import { TestService } from '../services/test';

// Database Entities
import { Test } from 'src/entities/Test';

// Utils
import { Logger } from '../utils/log';

// Inversify Types
import { TYPES } from '../types';



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
      this.logger.log(error, 'error');
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
      this.logger.log(error, 'error');
      return Promise.reject(next(error));
    }
  }

}