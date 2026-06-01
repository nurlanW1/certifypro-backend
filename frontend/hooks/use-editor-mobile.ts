"use client"

import { useEffect, useState } from "react"

const MOBILE_MAX = 768

export function useEditorMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX - 1}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return isMobile
}
