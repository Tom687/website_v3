import React, { lazy, Suspense } from 'react'
import { ReactComponent as RollingLoader } from '../../assets/icons/rolling.svg'

export default function SuspenseWrapper({ path }) {
  const LazyComponent = lazy(() => import(`../${path}`))

  return (
    <Suspense fallback={<RollingLoader/>}>
      <LazyComponent/>
    </Suspense>
  )
}