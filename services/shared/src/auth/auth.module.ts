import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigurableModuleClass } from './auth.config'
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule extends ConfigurableModuleClass {}
