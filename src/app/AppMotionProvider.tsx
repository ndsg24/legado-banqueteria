import type { PropsWithChildren } from 'react'
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion'

export function AppMotionProvider({ children }: PropsWithChildren) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
