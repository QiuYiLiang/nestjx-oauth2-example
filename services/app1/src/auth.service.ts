import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import axios from 'axios'
import { OidcClient } from 'oidc-client-ts'
import { v4 } from 'uuid'
import { enc } from 'crypto-js'

const baseUrl = 'http://localhost:3000'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  statesMap: Record<string, string> = {}
  async getOidcToken({ code, state }: { code: string; state: string }) {
    const authorization =
      'Basic ' +
      enc.Base64.stringify(
        enc.Utf8.parse('app1:strastrastrcxdzxctwparstarstwqdqwfpat')
      )
    const code_verifier = this.statesMap[state]
    try {
      return await axios.post(
        'http://localhost:3000/oidc/token',
        {
          code,
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:5000/api/auth/login',
          code_verifier,
        },
        {
          headers: {
            Authorization: authorization,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          withCredentials: true,
        }
      )
    } catch (error) {
      console.log(error)
    }
  }
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
    const clientUrl = 'http://localhost:5001/api/auth'
    const oidcClient = new OidcClient({
      authority: `${baseUrl}/oidc`,
      client_id: 'app1',
      redirect_uri: `${clientUrl}/login/`,
      post_logout_redirect_uri: `${clientUrl}/logout/`,
      response_type: 'code',
      scope: 'openid',
      response_mode: 'query',
      filterProtocolClaims: true,
    })

    const { state, url } = await oidcClient.createSigninRequest({
      state: {},
      nonce: v4(),
    })
    this.statesMap[state.id] = state.code_verifier
    return url
  }
}
