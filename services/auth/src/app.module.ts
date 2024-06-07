import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { OidcProviderModule } from './oidc/oidc-provider.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      type: 'postgres',
      host: 'localhost',
      port: 54322,
      username: 'postgres',
      password: 'postgres',
      database: 'oauth',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    OidcProviderModule,
  ],
})
export class AppModule {}
