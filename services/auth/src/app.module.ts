import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { OidcProviderModule } from './oidc/oidc-provider.module'
import configuration from './config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          autoLoadEntities: true,
          type: configService.get('db.type'),
          host: configService.get('db.host'),
          port: configService.get('db.port'),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          database: configService.get('db.database'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: configService.get('db.synchronize'),
          logging: false,
        } as TypeOrmModuleOptions
      },
      inject: [ConfigService],
    }),
    OidcProviderModule,
  ],
  providers: [],
})
export class AppModule {}
