import { useMemo, useState } from 'react'

type Props = {
  filename: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}

function publicImageUrl(filename: string) {
  const base = (import.meta as any).env?.BASE_URL ?? '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}images/${filename}`
}

function imageFallbackUrl(filename: string) {
  return `https://fannu-bazaar.vercel.app/images/${filename}`
}

export default function Illustration({ filename, alt, className = '', loading = 'lazy' }: Props) {
  const [failed, setFailed] = useState(false)

  const src = useMemo(() => {
    return failed ? imageFallbackUrl(filename) : publicImageUrl(filename)
  }, [failed, filename])

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (failed) return
        console.error('Failed to load image:', publicImageUrl(filename), 'Falling back to:', imageFallbackUrl(filename))
        setFailed(true)
      }}
    />
  )
}
