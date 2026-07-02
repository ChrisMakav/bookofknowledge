'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?:    string
  onChange:  (url: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const inputRef     = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Fichier image uniquement (jpg, png, webp…)')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const sigRes = await fetch('/api/upload', { method: 'POST' })
      if (!sigRes.ok) throw new Error('Erreur signature Cloudinary')
      const { timestamp, signature, apiKey, cloudName, uploadPreset } = await sigRes.json() as {
        timestamp: number; signature: string; apiKey: string; cloudName: string; uploadPreset?: string
      }

      const form = new FormData()
      form.append('file', file)
      form.append('api_key', apiKey)
      form.append('timestamp', String(timestamp))
      form.append('signature', signature)
      if (uploadPreset) form.append('upload_preset', uploadPreset)

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body:   form,
      })
      if (!uploadRes.ok) throw new Error('Échec de l\'upload')
      const data = await uploadRes.json() as { secure_url: string }
      onChange(data.secure_url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Couverture" className="w-24 h-36 object-cover rounded-lg border border-border" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
          >
            <X size={11} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-brand-400 transition-colors cursor-pointer"
        >
          {loading ? (
            <div className="size-5 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
          ) : (
            <>
              <Upload size={18} className="text-text-muted" />
              <p className="text-xs text-text-muted">Glisser-déposer ou cliquer</p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}
