import { Controller, Get } from '@nestjs/common'
import { UserService } from './user.service'
import { Cookies } from 'src/decorators/cookies.decorator'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('getUserInfo')
  getUserInfo(@Cookies('x-token') token: string) {
    return this.userService.getUserInfo(token)
  }
}
