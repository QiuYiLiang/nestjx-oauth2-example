import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { OidcClient } from 'oidc-client-ts'
import { v4 } from 'uuid'
import { enc } from 'crypto-js'

// 认证服务器地址
const oauthUrl = 'http://localhost:3000/oidc'
// 本机地址
const siteUrl = 'http://localhost:5001/api/auth'
// 授权返回
const scope = 'openid email'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  // TODO: 改为 redis 缓存用户 oauth state
  statesMap: Record<string, any> = {}
  // 登陆完成，code 换 token
  async loginFinished({
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
        `${oauthUrl}/token`,
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
      await axios.get(`${oauthUrl}/me`, {
        params: { access_token },
      })
    ).data
    return await this.jwtService.signAsync(userInfo, { expiresIn: '1h' })
  }
  // 校验 token 是否有效
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
  // 获取 oauth 登陆链接
  async getOAuthLoginUrl() {
    const oidcClient = new OidcClient({
      authority: oauthUrl,
      client_id: 'app1',
      // 用户登陆后，oauth 服务器会回掉到本服务，并带上code，获取 token
      redirect_uri: `${siteUrl}/loginFinished`,
      post_logout_redirect_uri: `${siteUrl}/logout/`,
      response_type: 'code',
      scope,
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
