/**
 * Deletes all properties with undefined value from an object.
 * @param obj object
 */
export function deleteUndefinedProperties(obj?: Record<string, any>): void {
  if (!obj) {
    return
  }
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key]
    }
  }
}
