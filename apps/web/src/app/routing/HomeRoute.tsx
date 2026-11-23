import { Navigate, useLocation } from 'react-router'
import { HomePage } from '../../pages/home'
import { AppMotionProvider } from '../providers/AppMotionProvider'

import '../styles/hero.css'

export function HomeRoute() {
  const { hash, search } = useLocation()
  if (hash === '#cotizar') return <Navigate replace to={{ pathname: '/cotizar.html', search }} />
  return (
    <AppMotionProvider>
      <HomePage />
    </AppMotionProvider>
  )
}
