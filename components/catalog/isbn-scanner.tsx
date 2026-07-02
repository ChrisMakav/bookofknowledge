'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, Camera, Keyboard } from 'lucide-react'
import type { IScannerControls } from '@zxing/browser'
import { getBookByISBN } from '@/actions/books'

interface ISBNScannerProps {
  onClose: () => void
}

export function ISBNScanner({ onClose }: ISBNScannerProps) {
  const router       = useRouter()
  const videoRef     = useRef<HTMLVideoElement>(null)
  const controlsRef  = useRef<IScannerControls | null>(null)
  const [mode,   setMode]   = useState<'camera' | 'manual'>('camera')
  const [manual, setManual] = useState('')
  const [status, setStatus] = useState<'scanning' | 'found' | 'not_found'>('scanning')
  const [cameraError, setCameraError] = useState<string | null>(null)

  const handleISBN = useCallback(async (isbn: string) => {
    controlsRef.current?.stop()
    const book = await getBookByISBN(isbn.trim())
    if (book) {
      setStatus('found')
      setTimeout(() => { onClose(); router.push(`/livres/${book.slug}`) }, 600)
    } else {
      setStatus('not_found')
      setTimeout(() => setStatus('scanning'), 2500)
    }
  }, [router, onClose])

  useEffect(() => {
    if (mode !== 'camera') return

    let cancelled = false

    async function startScanner() {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const reader   = new BrowserMultiFormatReader()
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current ?? undefined,
          (result, err) => {
            if (cancelled) return
            if (result) {
              const text = result.getText()
              if (/^97[89]\d{10}$/.test(text) || /^\d{9}[\dX]$/.test(text)) {
                handleISBN(text)
              }
            }
            void err
          }
        )
        if (!cancelled) controlsRef.current = controls
        else controls.stop()
      } catch {
        if (!cancelled) {
          setCameraError('Impossible d\'accéder à la caméra. Vérifiez les permissions.')
          setMode('manual')
        }
      }
    }

    startScanner()

    return () => {
      cancelled = true
      controlsRef.current?.stop()
      controlsRef.current = null
    }
  }, [mode, handleISBN])

  function switchToManual() {
    controlsRef.current?.stop()
    controlsRef.current = null
    setMode('manual')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface-card rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-text-primary">Scanner un ISBN</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="size-8 flex items-center justify-center rounded-lg hover:bg-surface-subtle text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 px-5 pt-4">
          <button
            onClick={() => setMode('camera')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'camera' ? 'bg-brand-600 text-white' : 'text-text-secondary hover:bg-surface-subtle'}`}
          >
            <Camera size={14} /> Caméra
          </button>
          <button
            onClick={switchToManual}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'manual' ? 'bg-brand-600 text-white' : 'text-text-secondary hover:bg-surface-subtle'}`}
          >
            <Keyboard size={14} /> Manuel
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {mode === 'camera' ? (
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black">
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
              {/* Viseur */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 h-1/4 border-2 border-brand-400 rounded-md opacity-80" />
              </div>
              {status === 'found' && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/30">
                  <span className="text-white font-bold text-lg">Trouvé !</span>
                </div>
              )}
              {status === 'not_found' && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    ISBN non trouvé dans le catalogue
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="978-2-07-036024-5"
                inputMode="numeric"
                className="h-11 w-full rounded-lg border border-border bg-surface-page px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && manual.trim()) handleISBN(manual.replace(/-/g, ''))
                }}
              />
              {status === 'not_found' && (
                <p className="text-xs text-error">ISBN non trouvé dans le catalogue.</p>
              )}
              <button
                onClick={() => handleISBN(manual.replace(/-/g, ''))}
                disabled={!manual.trim()}
                className="h-10 w-full rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Rechercher
              </button>
            </div>
          )}

          {cameraError && <p className="text-xs text-error">{cameraError}</p>}

          <p className="text-xs text-text-muted text-center">
            Pointez la caméra sur le code-barres ISBN du livre
          </p>
        </div>
      </div>
    </div>
  )
}
