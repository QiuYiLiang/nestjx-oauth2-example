import { Controller, Get, Next, Post, Req, Res } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { OidcProviderService } from '../oidc-provider.service'
import * as assert from 'assert'
import { BaseGrantableEntity } from '../entities/BaseGrantableEntity'
import { AccountService } from '../account/account.service'

@Controller('interaction')
export class InteractionsController {
  constructor(
    private oidcService: OidcProviderService,
    private accountService: AccountService
  ) {}

  // 获取登录页状态
  @Post('getStatus')
  async getStatus(@Req() req: Request, @Res() res: Response) {
    try {
      const details = await this.oidcService.oidc.interactionDetails(req, res)
      const { uid, prompt, params } = details

      const client = await this.oidcService.oidc.Client.find(
        params.client_id as string
      )

      if (prompt.name === 'login') {
        res.json({
          mode: 'login',
        })
        return
      }

      if (prompt.name === 'consent') {
        res.json({
          mode: 'interaction',
          data: {
            client,
            uid,
            details: prompt.details,
            params,
            title: 'Authorize',
          },
        })
        return
      }
    } catch (err) {
      res.json({
        mode: 'error',
        errMsg: '错误',
      })
    }
  }

  // 登录
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const { prompt } = await this.oidcService.oidc.interactionDetails(
        req,
        res
      )
      assert.strictEqual(prompt.name, 'login')
      const accountId = await this.accountService.authenticate(
        req.body.email,
        req.body.password
      )

      if (!accountId) {
        res.json({
          success: false,
          errMsg: '密码错误',
        })
        return
      }

      const result = {
        login: { accountId },
      }

      const data = await this.oidcService.oidc.interactionResult(
        req,
        res,
        result,
        {
          mergeWithLastSubmission: false,
        }
      )

      res.json({
        success: true,
        data,
      })
    } catch (err) {
      res.json({
        success: false,
      })
    }
  }
  // 同意授权
  @Post('authorization')
  async authorization(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction
  ) {
    try {
      const interactionDetails = await this.oidcService.oidc.interactionDetails(
        req,
        res
      )
      const {
        prompt: { name, details },
        params,
        session: { accountId },
      } = interactionDetails
      assert.strictEqual(name, 'consent')

      let { grantId } = interactionDetails
      let grant

      if (grantId) {
        grant = await this.oidcService.oidc.Grant.find(grantId)
      } else {
        grant = new this.oidcService.oidc.Grant({
          accountId,
          clientId: params.client_id as string,
        })
      }

      if (details.missingOIDCScope) {
        grant.addOIDCScope((details.missingOIDCScope as string[]).join(' '))
      }
      if (details.missingOIDCClaims) {
        grant.addOIDCClaims(details.missingOIDCClaims as string[])
      }
      if (details.missingResourceScopes) {
        for (const [indicator, scopes] of Object.entries(
          details.missingResourceScopes
        )) {
          grant.addResourceScope(indicator, (scopes as string[]).join(' '))
        }
      }

      grantId = await grant.save()

      const consent = {} as BaseGrantableEntity
      if (!interactionDetails.grantId) {
        consent.grantId = grantId
      }

      const result = { consent }
      const data = await this.oidcService.oidc.interactionResult(
        req,
        res,
        result as any,
        {
          mergeWithLastSubmission: true,
        }
      )
      res.json({
        success: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  }

  @Get(':uid/abort')
  async abortInteraction(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction
  ) {
    try {
      const result = {
        error: 'access_denied',
        error_description: 'End-User aborted interaction',
      }
      await this.oidcService.oidc.interactionFinished(req, res, result, {
        mergeWithLastSubmission: false,
      })
    } catch (err) {
      next(err)
    }
  }
}
