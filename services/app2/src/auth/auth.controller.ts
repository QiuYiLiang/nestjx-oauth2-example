import { Controller, Get, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'

const targetUrl = 'http://localhost:5002'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('login')
  async login(@Res() res: Response) {
    const oauthloginUrl = await this.authService.getOAuthLoginUrl()
    res.redirect(oauthloginUrl)
  }
  @Get('loginFinished')
  async loginFinished(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {
    try {
      if (code) {
        const token = await this.authService.loginFinished({ code, state })
        res.cookie('x-login', 1)
        res.cookie('x-token', token, {
          httpOnly: true,
        })
      }
      // 登陆完成跳转页面
      res.redirect(targetUrl)
    } catch (error) {
      res.redirect('/api/login')
    }
  }
}
