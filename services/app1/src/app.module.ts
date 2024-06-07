import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './gurads/auth.guard'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { AuthService } from './auth/auth.service'
import configuration from './config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    JwtModule.registerAsync({
      useFactory() {
        return {
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }
      },
    }),
    AuthModule,
    UserModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
