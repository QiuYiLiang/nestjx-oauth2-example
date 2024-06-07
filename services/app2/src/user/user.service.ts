import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}
  getUserInfo(token?: string) {
    return this.jwtService.decode(token)
  }
}
