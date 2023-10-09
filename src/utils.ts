import fs from 'node:fs'
import type { ConfigItem } from './types'
import { resolve } from 'path'

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

const rulesOn = new Set<string>()
const rulesOff = new Set<string>()

export function recordRulesStateConfigs(configs: ConfigItem[]): ConfigItem[] {
  for (const config of configs)
    recordRulesState(config.rules ?? {})

  return configs
}

export function recordRulesState(rules: ConfigItem['rules']): ConfigItem['rules'] {
  for (const [key, value] of Object.entries(rules ?? {})) {
    const firstValue = Array.isArray(value) ? value[0] : value
    if (firstValue == null)
      continue
    if (firstValue === 'off' || firstValue === 0)
      rulesOff.add(key)
    else
      rulesOn.add(key)
  }

  return rules
}

export function warnUnnecessaryOffRules() {
  const unnecessaryOffRules = [...rulesOff].filter(key => !rulesOn.has(key))

  for (const off of unnecessaryOffRules)
    console.warn(`[eslint] rule \`${off}\` is never turned on, you can remove the rule from your config`)
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
