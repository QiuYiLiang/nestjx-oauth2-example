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
  statesMap: Record<string, any> = {}
  async getOidcUserInfo({
    code,
    state: stateId,
  }: {
    code: string
    state: string
  }) {
    const authorization =
      'Basic ' +
      enc.Base64.stringify(
        enc.Utf8.parse('app1:strastrastrcxdzxctwparstarstwqdqwfpat')
      )
    const state = this.statesMap[stateId]
    const code_verifier = state.code_verifier
    const access_token = (
      await axios.post(
        'http://localhost:3000/oidc/token',
        {
          code,
          grant_type: 'authorization_code',
          redirect_uri: state.redirect_uri,
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
    ).data.access_token
    const userInfo = (
      await axios.get('http://localhost:3000/oidc/me', {
        params: { access_token },
      })
    ).data
    return userInfo
  }
  async createToken(payload: any) {
    return await this.jwtService.signAsync(payload)
  }
  async validateToken(token?: string) {
    if (!token) {
      return false
    }
    try {
      const data = await this.jwtService.verifyAsync(token)
      return typeof data.email === 'string'
    } catch (error) {
      console.log(error)
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
      scope: 'openid email',
      filterProtocolClaims: true,
    })

    const { state, url } = await oidcClient.createSigninRequest({
      state: {},
      nonce: v4(),
    })
    this.statesMap[state.id] = state
    return url
  }
}
