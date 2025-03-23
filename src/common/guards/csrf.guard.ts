// TODO: Configure and setup CSRF properly
// import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
// import { Request } from 'express';
//
// @Injectable()
// export class CsrfGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const request: Request = context.switchToHttp().getRequest();
//     const csrfTokenCookie = request.cookies['_csrf'];
//     const csrfTokenBody = request.headers['x-csrf-token'] || request.body?._csrf;
//
//     if (!csrfTokenBody || csrfTokenCookie !== csrfTokenBody) {
//       throw new ForbiddenException('Invalid CSRF token');
//     }
//     return true;
//   }
// }
