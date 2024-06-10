import { Controller, Get, Inject, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { AuthModuleOptions, MODULE_OPTIONS_TOKEN } from './auth.config'

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(MODULE_OPTIONS_TOKEN) private options: AuthModuleOptions
  ) {}
  @Get('login')
  async login(@Res() res: Response) {
    const oauthLoginUrl = await this.authService.getOAuthLoginUrl()
    res.redirect(oauthLoginUrl)
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
          expires: new Date(Date.now() + 60 * 60 * 24),
          sameSite: 'lax',
        })
      }
      // 登陆完成跳转页面
      res.redirect(this.options.targetUrl)
    } catch (error) {
      res.redirect('/api/login')
    }
  }
  @Get('logout')
  async logout(@Res() res: Response) {
    const oauthLogoutUrl = await this.authService.getOAuthLogoutUrl()
    res.redirect(oauthLogoutUrl)
  }
  @Get('logoutFinished')
  async logoutFinished(@Res() res: Response) {
    res.cookie('x-login', '')
    res.cookie('x-token', '')
    res.redirect(this.options.targetUrl)
  }
}
