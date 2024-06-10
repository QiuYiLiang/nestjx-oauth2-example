import { ConfigurableModuleBuilder } from '@nestjs/common'

export interface AuthModuleOptions {
  clientId: string
  clientSecret: string
  targetUrl: string
  scopes: string[]
  localUrl: string
  oidcUrl: string
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AuthModuleOptions>().build()
