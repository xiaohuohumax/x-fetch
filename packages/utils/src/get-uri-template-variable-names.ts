/**
 * Get the names of the variables in an RFC6570 URI template.
 *
 * Parameters for the RFC6570 URI template.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6570
 *
 * Example usage:
 *
 * ```typescript
 * const urlTemplate = "https://example.com/api/{id}{?query}"
 * const variableNames = getUriTemplateVariableNames(urlTemplate)
 * console.log(variableNames) // Set(2) { "id", "query" }
 * ```
 * @param urlTemplate URI template string.
 * @returns Set of variable names.
 */
export function getUriTemplateVariableNames(urlTemplate: string): Set<string> {
  const matches = urlTemplate.match(/\{[^}]+\}/g)
  const names: Set<string> = new Set()

  if (!matches) {
    return names
  }

  for (const match of matches) {
    const items = match.split(/,/)
    for (const item of items) {
      names.add(item.replaceAll(/^\W+|:\d+\W*$|\W+$/g, ""))
    }
  }

  return new Set(names)
}
