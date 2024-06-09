import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigurableModuleClass } from './auth.config'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from 'src/gurads/auth.guard'
import { GlobalJwtModule } from 'src/jwt/jwt.module'
import { GlobalConfigModule } from 'src/config/config.module'
@Module({
  imports: [GlobalConfigModule, GlobalJwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule extends ConfigurableModuleClass {}
