import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    const response: Response = context.switchToHttp().getResponse()
    if (
      request.url.startsWith('/api/login/') ||
      request.url.startsWith('/api/baseLogin')
    ) {
      // 排除登录接口
      return true
    }
    const token = request.cookies['x-token']
    const validRes = await this.authService.validateToken(token)
    if (validRes) {
      // token 验证通过
      return true
    }
    // token 失效，重新登录
    const loginUrl = await this.authService.getLoginUri()
    response.json({
      success: false,
      data: loginUrl,
    })
  }
}
