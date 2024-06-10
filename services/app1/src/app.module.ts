import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import {
  AuthGuard,
  AuthModule,
  GlobalConfigModule,
  GlobalJwtModule,
} from '@zero-code/shared'

@Module({
  imports: [
    GlobalConfigModule,
    GlobalJwtModule,
    AuthModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          clientId: configService.get('clientId'),
          clientSecret: configService.get('clientSecret'),
          targetUrl: configService.get('targetUrl'),
          scopes: configService.get('scopes'),
          localUrl: configService.get('localUrl'),
          oidcUrl: configService.get('oidcUrl'),
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
