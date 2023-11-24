// Packages
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, requestBody } from 'inversify-express-utils';

// Entities
import { Test } from '../entities/Test.js';

// Services
import { TestService } from '../services/test.js';

// Inversify Types
import { TYPES } from '../types/index.js';


@controller('/test')
export class TestController {
  constructor(
    @inject(TYPES.TEST_SERVICE)
    private readonly testService: TestService
  ) { }


  @httpGet('/')
  public async getTest(
    _request: Request,
    response: Response,
  ): Promise<void> {
    const result = await this.testService.getTest();
    response.json(result);
  }

  @httpPost('/')
  public async createTest(
    @requestBody() body: Test,
    _request: Request,
    response: Response,
  ): Promise<void> {
    const { message } = await this.testService.createTest(body);
    response.status(201).json({ message });
  }

}
