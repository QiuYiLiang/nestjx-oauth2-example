import { Controller, Get, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}
  @Get('baseLogin')
  baseLogin() {
    return ''
  }
  @Get('login')
  async login(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {
    if (code) {
      const userInfo = await this.authService.getOidcUserInfo({ code, state })
      res.cookie('x-token', await this.authService.createToken(userInfo))
    }
    res.redirect('http://localhost:5000')
  }
  @Get('getData')
  getData(): string {
    return 'hhh'
  }
}
