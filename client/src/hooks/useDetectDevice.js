import { useEffect, useState } from 'react'

export default function useDetectDevice() {
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    //console.log(`User's device is : ${window.navigator.userAgent}`);
    const userAgent =
      typeof navigator === 'undefined' ? '' : navigator.userAgent

    const mobile = Boolean(userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ))

    setMobile(mobile)
  }, [])

  return { isMobile }
}