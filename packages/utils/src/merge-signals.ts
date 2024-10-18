/**
 * Merge multiple AbortSignal into one.
 * @param signals The AbortSignal to merge.
 * @returns The merged AbortSignal. If all signals are null, returns null.
 */
export function mergeSignals(signals: (AbortSignal | null)[]): AbortSignal | null {
  const nonNullSignals = signals.filter(s => s !== null)

  if (nonNullSignals.length === 0) {
    return null
  }

  if (nonNullSignals.length === 1) {
    return nonNullSignals[0]
  }

  const controller = new AbortController()
  let isAborted = false

  const onAbort = () => {
    if (isAborted) {
      return
    }
    isAborted = true

    for (const s of nonNullSignals) {
      if (s.aborted) {
        controller.abort(s.reason)
        break
      }
    }

    for (const s of nonNullSignals) {
      s.removeEventListener("abort", onAbort)
    }
  }

  for (const s of nonNullSignals) {
    if (s.aborted) {
      onAbort()
      break
    }
    s.addEventListener("abort", onAbort, { once: true })
  }

  return controller.signal
}
