import type { Retry } from "./types"

export const DEFAULTS: Required<Retry> = {
  enabled: false,
  doNotRetry: [400, 401, 403, 404, 422, 451],
  // promise-retry => retry
  // https://github.com/IndigoUnited/node-promise-retry
  // https://github.com/tim-kos/node-retry?tab=readme-ov-file#api
  // 10 -> 3
  retries: 3,
  forever: false,
  unref: false,
  maxRetryTime: Infinity,
  factor: 2,
  minTimeout: 1000,
  maxTimeout: Infinity,
  randomize: false,
}
