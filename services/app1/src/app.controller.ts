import { Controller, Get, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { Cookies } from './decorators/cookies.decorator'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}
  @Get('baseLogin')
  async baseLogin(@Res() res: Response) {
    res.redirect(await this.authService.getLoginUri())
  }
  @Get('login')
  async login(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {
    if (code) {
      const userInfo = await this.authService.getOidcUserInfo({ code, state })
      const token = await this.authService.createToken(userInfo)
      res.cookie('x-login', 1)
      res.cookie('x-token', token, {
        httpOnly: true,
      })
    }
    res.redirect('http://localhost:5001')
  }
  @Get('getUserInfo')
  getUserInfo(@Cookies('x-token') token: string) {
    return this.authService.getUserInfo(token)
  }
}
