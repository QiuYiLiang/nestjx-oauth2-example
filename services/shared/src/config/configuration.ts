import { readFileSync } from 'fs'
import { load } from 'js-yaml'
import { resolve } from 'path'

const YAML_CONFIG_FILENAME = './config.yaml'

export function configuration() {
  return load(readFileSync(resolve(YAML_CONFIG_FILENAME), 'utf8')) as Record<
    string,
    any
  >
}
