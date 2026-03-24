import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { userService } from '@/services/user.service'
import { useAuth } from '@/hooks/useAuth'
import InterestSelector from '@/components/auth/InterestSelector'
import type { InterestCategory, User } from '@/types'

function Gold({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {children}
    </span>
  )
}

export default function Settings() {
  const { user, setUser, logout } = useAuth()
  const qc = useQueryClient()

  // Local state — user.interests se initialize, live update hoga
  const [interests, setInterests] = useState<InterestCategory[]>(
    (user?.interests || []) as InterestCategory[]
  )

  const updatePrefs = useMutation({
    mutationFn: () => userService.updatePreferences(interests),
    onSuccess: (res) => {
      toast.success('Interests updated!')
      // ── Fix: user store + query cache dono update karo ──
      if (res.data) {
        setUser(res.data as User)
        qc.setQueryData(['me'], res)
      }
      qc.invalidateQueries({ queryKey: ['recommendations'] })
    },
    onError: () => toast.error('Failed to update interests'),
  })

  return (
    <div className="max-w-xl mx-auto space-y-4 py-2">
      <div className="mb-6">
        <h1 className="text-xl font-black" style={{ color: '#f0f0fa' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: '#50508a' }}>Manage your account preferences</p>
      </div>

      {/* Interests */}
      <div className="rounded-2xl p-6 space-y-5"
        style={{ background: '#0d0d1a', border: '1px solid rgba(212,168,67,0.15)' }}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-white">Reading Interests</h2>
            {/* Live count — local state se */}
            <span className="text-xs px-2 py-0.5 rounded-lg font-bold"
              style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)', color: '#d4a843' }}>
              {interests.length} selected
            </span>
          </div>
          <p className="text-sm" style={{ color: '#50508a' }}>These determine what appears in your feed</p>
        </div>
        <InterestSelector selected={interests} onChange={setInterests} dark />
        <button
          onClick={() => updatePrefs.mutate()}
          disabled={updatePrefs.isPending || interests.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-black transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: '0 4px 16px rgba(212,168,67,0.3)' }}>
          {updatePrefs.isPending ? 'Saving...' : 'Save interests'}
        </button>
      </div>

      {/* Account info */}
      <div className="rounded-2xl p-6 space-y-3"
        style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 className="font-black text-white mb-3">Account</h2>
        {[
          { label: 'Username', value: user?.username || '' },
          { label: 'Email',    value: user?.email    || '' },
          { label: 'Status',   value: 'Active' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between py-2.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-sm" style={{ color: '#50508a' }}>{label}</span>
            <span className="text-sm font-semibold">
              {label === 'Status'
                ? <Gold>{value}</Gold>
                : <span style={{ color: '#e0e0f0' }}>{value}</span>
              }
            </span>
          </div>
        ))}
      </div>

      {/* Danger */}
      <div className="rounded-2xl p-6"
        style={{ background: '#0d0d1a', border: '1px solid rgba(239,68,68,0.15)' }}>
        <h2 className="font-black mb-4" style={{ color: '#ef4444' }}>Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Sign out</p>
            <p className="text-xs mt-0.5" style={{ color: '#50508a' }}>Sign out from this device</p>
          </div>
          <button onClick={logout}
            className="px-4 py-2 rounded-xl text-sm font-black transition-all hover:scale-105"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}