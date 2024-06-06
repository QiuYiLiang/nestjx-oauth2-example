import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const response: Response = context.switchToHttp().getResponse()
    const headers = request.headers
    const token = headers['x-token']
    const validRes = await this.authService.validateToken(token)
    if (validRes) {
      return true
    }
    const loginUrl = await this.authService.getLoginUri()
    response.redirect(loginUrl)
  }
}
