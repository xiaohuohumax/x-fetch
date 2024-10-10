import type { XFetchOptions } from "@xiaohuohumax/x-fetch-core"
import "@xiaohuohumax/x-fetch-request"

/**
 * Template options
 */
export interface Template {
  enabled?: boolean
}

/**
 * Template plugin options
 */
export interface TemplatePluginOptions extends XFetchOptions {
  template?: Template
}

/**
 * Template plugin interface.
 */
export interface TemplatePlugin { }

declare module "@xiaohuohumax/x-fetch-core" {
  interface XFetchOptions { }
}

declare module "@xiaohuohumax/x-fetch-request" {
  /**
   * Add hook types for template plugin.
   *
   * @see https://www.npmjs.com/package/before-after-hook
   */
  interface RequestHooks {
    // "template": {
    //   Options: any
    //   Result: any
    //   Error: any
    // }
  }
}
