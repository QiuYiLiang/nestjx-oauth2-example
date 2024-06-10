import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { OidcClient } from 'oidc-client-ts'
import { v4 } from 'uuid'
import { enc } from 'crypto-js'

const authUrl = 'http://localhost:3000'

// 认证服务器地址
const oidcUrl = `${authUrl}/oidc`
// 本机地址
const siteUrl = 'http://127.0.0.1:3002/api'
// 授权返回
const scope = 'openid email'

@Injectable()
export class AuthService {
  private oidcClient: OidcClient
  constructor(private jwtService: JwtService) {
    this.oidcClient = new OidcClient({
      authority: oidcUrl,
      client_id: 'app2',
      // 用户登陆后，oauth 服务器会回掉到本服务，并带上code，获取 token
      redirect_uri: `${siteUrl}/loginFinished`,
      post_logout_redirect_uri: `${siteUrl}/logoutFinished`,
      response_type: 'code',
      scope,
      filterProtocolClaims: true,
    })
  }
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
    // TODO: 使用 refreshToken 刷新
    const authorization =
      'Basic ' +
      enc.Base64.stringify(
        enc.Utf8.parse('app2:strastrastrcxdzxctwparstarstwqdqwfpat')
      )
    const state = this.statesMap[stateId]
    const code_verifier = state.code_verifier
    const access_token = (
      await axios.post(
        `${oidcUrl}/token`,
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
      await axios.get(`${oidcUrl}/me`, {
        params: { access_token },
      })
    ).data
    return await this.jwtService.signAsync(userInfo)
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
    const { state, url } = await this.oidcClient.createSigninRequest({
      state: {},
      nonce: v4(),
    })
    this.statesMap[state.id] = state
    return url
  }
  // 获取 oauth 登出链接
  async getOAuthLogoutUrl() {
    const { url } = await this.oidcClient.createSignoutRequest({
      state: {},
    })
    return url
  }
}
