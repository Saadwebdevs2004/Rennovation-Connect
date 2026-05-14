"use client"

import { useEffect, useState, RefObject } from "react"

export function useInView(
  ref: RefObject<Element | null>,
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: "0px" }
): boolean {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.unobserve(element)
      }
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isInView
}
