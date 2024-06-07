import { Injectable, Logger } from '@nestjs/common'
import { Provider } from 'oidc-provider'
import { jwks } from '../jwks'
import { AccountService } from './account/account.service'
import { ConfigService } from '@nestjs/config'
import { createTypeOrmAdapter } from './adapter/createTypeOrmAdapter'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Injectable()
export class OidcProviderService {
  private readonly _oidc: Provider
  private readonly _logger: Logger

  constructor(
    @InjectDataSource()
    dataSource: DataSource,
    private accountService: AccountService,
    private configService: ConfigService
  ) {
    this._logger = new Logger('OidcProviderService')
    this._oidc = new Provider(`http://localhost:3000`, {
      cookies: {
        keys: this.configService.get('secureKey'),
      },
      jwks,
      clients: this.configService.get('client'),
      adapter: createTypeOrmAdapter(dataSource),
      findAccount: this.accountService.findAccount.bind(this.accountService),
      interactions: {
        url(ctx, interaction) {
          const { uid } = interaction
          return `http://localhost:5000/?uid=${uid}`
        },
      },
      claims: {
        openid: ['sub'],
        email: ['email', 'fullName'],
      },
      features: {
        devInteractions: { enabled: false },
      },
    })
    this._oidc.on(
      'authorization_code.saved',
      this._logger.log.bind(this._logger)
    )
    this._oidc.on('grant.error', console.log)
    this._oidc.on('introspection.error', this._logger.log.bind(this._logger))
    this._oidc.on('revocation.error', this._logger.log.bind(this._logger))
  }

  get oidc() {
    return this._oidc
  }
}
