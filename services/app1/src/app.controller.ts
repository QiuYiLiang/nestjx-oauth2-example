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
      const data = await this.authService.getOidcToken({ code, state })
      console.log(data)
    }
    res.redirect('http://localhost:5000')
  }
  @Get('getData')
  getData(): string {
    return 'hhh'
  }
}
