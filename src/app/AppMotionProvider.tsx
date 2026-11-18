import type { PropsWithChildren } from 'react'
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion'
import { PageTransition } from '../components/layout/PageTransition'

export function AppMotionProvider({ children }: PropsWithChildren) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user"><PageTransition />{children}</MotionConfig>
    </LazyMotion>
  )
}
