import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OidcProviderModule } from './oidc/oidc-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      logging: true,
    }),
    OidcProviderModule,
  ]
})
export class AppModule {}
