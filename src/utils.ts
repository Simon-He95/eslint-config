import fs from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import type { ConfigItem } from './types'

/**
 * Combine array and non-array configs into a single array.
 */
export function combine(...configs: (ConfigItem | ConfigItem[])[]): ConfigItem[] {
  return configs.flatMap(config => Array.isArray(config) ? config : [config])
}

export function renameRules(rules: Record<string, any>, from: string, to: string) {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        if (key.startsWith(from))
          return [to + key.slice(from.length), value]
        return [key, value]
      }),
  )
}

export function getEslintIgnore() {
  const url = resolve(process.cwd(), '.eslintignore')
  if (!fs.existsSync(url))
    return undefined
  const ignores = fs.readFileSync(url, 'utf-8')
  const data = ignores.split('\n').map((r) => {
    const trimmed = r.trim()
    if (/^(\/\/|#)/.test(trimmed))
      return false
    return trimmed
  }).filter(Boolean)
  return data as string[]
}
