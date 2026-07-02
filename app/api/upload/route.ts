import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey       = process.env.CLOUDINARY_API_KEY
  const apiSecret    = process.env.CLOUDINARY_API_SECRET
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? ''

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 503 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const toSign    = `timestamp=${timestamp}${uploadPreset ? `&upload_preset=${uploadPreset}` : ''}${apiSecret}`
  const signature = createHash('sha1').update(toSign).digest('hex')

  return NextResponse.json({ timestamp, signature, apiKey, cloudName, uploadPreset: uploadPreset || undefined })
}
