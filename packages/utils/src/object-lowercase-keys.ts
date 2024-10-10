/**
 * Convert object keys to lowercase
 * @param obj object
 * @returns object with lowercase keys
 */
export function objectLowercaseKeys<T extends Record<string, any>>(obj?: T): T | undefined {
  if (!obj) {
    return obj
  }
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [
        key.toLowerCase(),
        value,
      ]),
  ) as T
}
