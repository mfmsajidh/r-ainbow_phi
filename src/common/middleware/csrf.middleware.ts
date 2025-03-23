// TODO: Configure and setup CSRF properly
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { doubleCsrf } from 'csrf-csrf';
// import { csrfConfig } from '../../config/csrf.config';
//
// @Injectable()
// export class CsrfMiddleware implements NestMiddleware {
//   private csrfProtection = doubleCsrf(csrfConfig);
//
//   use(req: Request, res: Response, next: NextFunction) {
//     this.csrfProtection.doubleCsrfProtection(req, res, next);
//   }
// }
