import type { XFetch } from "@xiaohuohumax/x-fetch-core"
import type { Template, TemplatePlugin, TemplatePluginOptions } from "./types"
import { DEFAULTS } from "./defaults"

/**
 * Template plugin for XFetch
 * @param xFetch XFetch instance
 * @param options Plugin options
 * @returns Plugin instance
 */
export function templatePlugin(xFetch: XFetch, options: TemplatePluginOptions): TemplatePlugin {
  // plugin options merge
  const state: Required<Template> = Object.assign(DEFAULTS, options.template)
  if (state.enabled) {
    // do something
  }
  // plugin inject return
  return {}
}
