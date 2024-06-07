import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from 'src/auth/auth.service'

// 排除登录接口
const passUrls = ['/api/login', '/api/loginFinished']

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const response: Response = context.switchToHttp().getResponse()
    const { url } = request

    const isPass = passUrls.find((passUrl) => url.startsWith(passUrl))
    if (isPass) {
      return true
    }

    const token = request.cookies['x-token']
    const validRes = await this.authService.validateToken(token)
    if (validRes) {
      // token 验证通过
      return true
    }

    // token 失效，重新登录
    const loginUrl = await this.authService.getOAuthLoginUrl()
    response.json({
      success: false,
      data: loginUrl,
    })
  }
}
