import { ConfigurableModuleBuilder } from '@nestjs/common'
import { ConfigModuleOptions } from '@nestjs/config'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build()
