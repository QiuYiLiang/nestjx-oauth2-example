import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { OidcClient } from 'oidc-client-ts'

const baseUrl = 'http://localhost:3000'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async createToken() {
    return {
      access_token: await this.jwtService.signAsync({ uid: 'zhangsan' }),
    }
  }
  async validateToken(token?: string) {
    if (!token) {
      return false
    }
    try {
      const { uid } = await this.jwtService.verifyAsync(token)
      return typeof uid === 'string'
    } catch (error) {
      return false
    }
  }
  async getLoginUri() {
    const clientUrl = 'http://localhost:5001'
    const oidcClient = new OidcClient({
      authority: `${baseUrl}/oidc`,
      client_id: 'app1',
      redirect_uri: clientUrl,
      post_logout_redirect_uri: clientUrl,
      response_type: 'code',
      scope: 'openid',
      response_mode: 'fragment',
      filterProtocolClaims: true,
    })

    const req = await oidcClient.createSigninRequest({
      state: {},
    })

    return req.url
  }
}
