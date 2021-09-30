import { useRef, useEffect } from 'react'

// eslint-disable-next-line
const useUnload = (fn: any) => {
  const cb = useRef(fn) // init with fn, so that type checkers won't assume that current might be undefined

  useEffect(() => {
    cb.current = fn
  }, [fn])

  useEffect(() => {
    // eslint-disable-next-line
    const onUnload = (...args: any[]) => cb.current?.(...args)

    window.addEventListener('beforeunload', onUnload)

    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])
}

export default useUnload