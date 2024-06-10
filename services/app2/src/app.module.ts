import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import {
  AuthGuard,
  AuthModule,
  AuthService,
  GlobalConfigModule,
  GlobalJwtModule,
} from '@zero-code/shared'

@Module({
  imports: [GlobalConfigModule, GlobalJwtModule, AuthModule],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
