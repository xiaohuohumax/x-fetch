/**
 * Returns a new object without the omitted keys.
 * @param obj object
 * @param keys keys to omit
 * @returns object without omitted keys
 */
export function omit<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Omit<T, keyof T> {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => !keys.includes(key as keyof T)),
  ) as Omit<T, keyof T>
}
