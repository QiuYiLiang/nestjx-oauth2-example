import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('login')
  login() {
    return ''
  }
  @Get('getData')
  getData(): string {
    return 'hhh'
  }
}
