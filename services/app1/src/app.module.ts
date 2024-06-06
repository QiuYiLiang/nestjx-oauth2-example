import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { jwtSecret } from './jwtSecret'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory() {
        return {
          global: true,
          secret: jwtSecret,
          signOptions: { expiresIn: '60s' },
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    JwtService,
  ],
})
export class AppModule {}
