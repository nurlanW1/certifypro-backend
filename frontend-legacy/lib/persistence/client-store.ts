/** Dual-write session + local storage so drafts survive tab close and return visits */

function isBrowser() {
  return typeof window !== "undefined"
}

export function persistGet(key: string): string | null {
  if (!isBrowser()) return null
  try {
    const fromLocal = localStorage.getItem(key)
    if (fromLocal) return fromLocal
    const fromSession = sessionStorage.getItem(key)
    if (fromSession) {
      localStorage.setItem(key, fromSession)
      return fromSession
    }
  } catch {
    /* quota / private mode */
  }
  return null
}

export function persistSet(key: string, value: string) {
  if (!isBrowser()) return
  try {
    sessionStorage.setItem(key, value)
    localStorage.setItem(key, value)
  } catch {
    try {
      sessionStorage.setItem(key, value)
    } catch {
      /* ignore */
    }
  }
}

export function persistRemove(key: string) {
  if (!isBrowser()) return
  try {
    sessionStorage.removeItem(key)
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export function persistKeys(prefix: string): string[] {
  if (!isBrowser()) return []
  const keys = new Set<string>()
  for (const storage of [localStorage, sessionStorage]) {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key?.startsWith(prefix)) keys.add(key)
    }
  }
  return [...keys]
}
