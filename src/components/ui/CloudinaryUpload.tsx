import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Camera, Loader2 } from 'lucide-react'

const CLOUD  = import.meta.env.VITE_CLOUDINARY_CLOUD  || ''
const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || ''

async function uploadFile(file: File, folder: string): Promise<string> {
  if (!CLOUD || !PRESET) throw new Error('Cloudinary not configured in .env')

  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', PRESET)
  fd.append('folder', folder)

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST', body: fd,
  })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.secure_url as string
}

// ── Avatar upload — camera icon overlay ───────────────────
export function AvatarUpload({
  url, username, size = 76,
  editing, onUpload,
}: {
  url?: string
  username: string
  size?: number
  editing: boolean
  onUpload: (url: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5_000_000) { toast.error('Max 5MB'); return }
    setLoading(true)
    try {
      const newUrl = await uploadFile(file, 'recomr/avatars')
      onUpload(newUrl)
      toast.success('Avatar updated!')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setLoading(false)
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {url ? (
        <img src={url} alt={username} className="rounded-full object-cover w-full h-full"
          style={{ border: '3px solid rgba(212,168,67,0.5)', boxShadow: '0 0 20px rgba(212,168,67,0.3)' }} />
      ) : (
        <div className="rounded-full w-full h-full flex items-center justify-center font-black text-black"
          style={{ fontSize: size / 3, background: 'linear-gradient(135deg, #d4a843, #c8922a)', border: '3px solid rgba(212,168,67,0.5)', boxShadow: '0 0 20px rgba(212,168,67,0.3)' }}>
          {username.slice(0, 2).toUpperCase()}
        </div>
      )}

      {editing && (
        <>
          <button onClick={() => ref.current?.click()} disabled={loading}
            className="absolute inset-0 rounded-full flex items-center justify-center transition-opacity"
            style={{ background: 'rgba(0,0,0,0.55)' }}>
            {loading
              ? <Loader2 className="w-5 h-5 text-white animate-spin" />
              : <Camera className="w-5 h-5 text-white" />
            }
          </button>
          <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp"
            className="hidden" onChange={handle} />
        </>
      )}
    </div>
  )
}

// ── Cover upload — simple button ──────────────────────────
export function CoverUpload({
  editing, onUpload,
}: {
  editing: boolean
  onUpload: (url: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5_000_000) { toast.error('Max 5MB'); return }
    setLoading(true)
    try {
      const newUrl = await uploadFile(file, 'recomr/covers')
      onUpload(newUrl)
      toast.success('Cover updated!')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setLoading(false)
      if (ref.current) ref.current.value = ''
    }
  }

  if (!editing) return null

  return (
    <>
      <button
        onClick={() => ref.current?.click()}
        disabled={loading}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold z-10"
        style={{
          background: 'rgba(0,0,0,0.65)',
          border: '1px solid rgba(212,168,67,0.4)',
          color: '#d4a843',
          backdropFilter: 'blur(10px)',
          transition: 'background 0.2s, transform 0.15s',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={e => {
          if (!loading) {
            (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.22)'
            ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.65)'
          ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
        }}
      >
        {loading
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
          : <><Camera className="w-3.5 h-3.5" /> Change cover</>
        }
      </button>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp"
        className="hidden" onChange={handle} />
    </>
  )
}