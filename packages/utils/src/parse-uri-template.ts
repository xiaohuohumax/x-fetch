import { parseTemplate } from "url-template"
import { getUriTemplateVariableNames } from "./get-uri-template-variable-names"

/**
 * Parse URL template.
 *
 * Parameters for the RFC6570 URI template.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6570
 *
 * Example usage:
 *
 * ```typescript
 * const uri = parseUriTemplate("https://example.com/api/{id}", { id: 123, name: "John Doe" });
 *
 * console.log(uri); // "https://example.com/api/123?name=John%20Doe"
 * ```
 * @param urlTemplate URI template string
 * @param urlParams URL parameters
 * @returns Parsed URI string
 */
export function parseUriTemplate(urlTemplate: string, urlParams: Record<string, any>): string {
  const variableNames = getUriTemplateVariableNames(urlTemplate)

  const extParams = Object.keys(urlParams).filter(param => !variableNames.has(param))

  const extTemplates: string[] = extParams.map((name) => {
    return `{&${name}${Array.isArray(urlParams[name]) ? "*" : ""}}`
  })

  const uri = parseTemplate(urlTemplate).expand(urlParams)

  if (extTemplates.length === 0) {
    return uri
  }

  if (!uri.includes("?") && extTemplates.length > 0) {
    extTemplates[0] = extTemplates[0].replace("&", "?")
  }

  return parseTemplate(uri + extTemplates.join("")).expand(urlParams)
}
