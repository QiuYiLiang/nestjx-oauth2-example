import { ConfigurableModuleBuilder } from '@nestjs/common'

export interface AuthModuleOptions {
  targetUrl: string
  scopes: string[]
  siteUrl: string
  oidcUrl: string
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AuthModuleOptions>().build()
