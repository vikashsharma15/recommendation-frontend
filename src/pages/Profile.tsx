import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Twitter, Linkedin, Github, Edit2, Save, X,
  Calendar, Mail, Globe, Sparkles, User as UserIcon, AtSign
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/user.service'
import { formatDate } from '@/lib/utils'
import { AvatarUpload, CoverUpload } from '@/components/ui/CloudinaryUpload'
import type { User } from '@/types'

function Gold({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {children}
    </span>
  )
}


const categoryColors: Record<string, string> = {
  'World': '#3b82f6', 'Sports': '#f59e0b',
  'Business': '#10b981', 'Science/Technology': '#8b5cf6',
}

export default function Profile() {
  const { user, setUser } = useAuth()
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    full_name:  user?.full_name  || '',
    username:   user?.username || '',
    bio:        user?.bio        || '',
    avatar_url: user?.avatar_url || '',
    cover_url:  user?.cover_url  || '',
    twitter:    user?.twitter    || '',
    linkedin:   user?.linkedin   || '',
    github:     user?.github     || '',
  })
const updateUsername = useMutation({
  mutationFn: () => userService.updateUsername({ username: form.username }),

  onError: (err: any) => {
    toast.error(err?.response?.data?.detail || 'Username update failed')
  },
})
  const updateProfile = useMutation({
  mutationFn: async () => {
    // 1. profile update
    const profileRes = await userService.updateProfile({
      full_name: form.full_name,
      bio: form.bio,
      avatar_url: form.avatar_url,
      cover_url: form.cover_url,
      twitter: form.twitter,
      linkedin: form.linkedin,
      github: form.github,
    })

    let finalUser = profileRes.data

    // 2. username update
    if (form.username !== user?.username) {
      const usernameRes = await updateUsername.mutateAsync()

      // ⭐ YAHI FIX HAI
      finalUser = usernameRes.data
    }

    return finalUser
  },

  onSuccess: (finalUser) => {
    toast.success('Profile updated!')
    setEditing(false)

    qc.setQueryData(['me'], finalUser)
    qc.invalidateQueries({ queryKey: ['me'] })

    if (finalUser) setUser(finalUser as User)
  },

  onError: () => toast.error('Failed to update profile'),
})

  if (!user) return null

  // Username change info
  const changesThisMonth = user.username_change_count || 0
  const limit = 2
  const canChangeUsername = changesThisMonth < limit
  return (
    <div className="max-w-2xl mx-auto space-y-4 py-2">

      {/* Main card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(212,168,67,0.15)' }}>

        {/* Cover */}
        <div className="relative h-36"
          style={{
            background: form.cover_url
              ? `url(${form.cover_url}) center/cover no-repeat`
              : 'linear-gradient(135deg, #1a1040 0%, #12101e 40%, #0d1a2a 100%)',
          }}>
          {!form.cover_url && (
            <>
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 144" preserveAspectRatio="xMidYMid slice" fill="none">
                {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
                  const a=(i/12)*Math.PI*2
                  return <line key={i} x1="400" y1="72" x2={400+Math.cos(a)*500} y2={72+Math.sin(a)*500} stroke="#d4a843" strokeWidth="0.8"/>
                })}
                {[30,65,105,150].map(r => <circle key={r} cx="400" cy="72" r={r} fill="none" stroke="#d4a843" strokeWidth="0.7"/>)}
              </svg>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <img src="/spiderchat.png" alt="" style={{ width:90, height:90, opacity:0.07, filter:'sepia(1) saturate(2)', objectFit:'contain' }} />
              </div>
            </>
          )}
          <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, transparent 50%, rgba(13,13,26,0.85) 100%)' }} />
          <CoverUpload editing={editing} onUpload={url => setForm(f => ({ ...f, cover_url: url }))} />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar + edit row */}
          <div className="flex items-end justify-between mb-4" style={{ marginTop:'-38px', position:'relative', zIndex:10 }}>
            <AvatarUpload
              url={form.avatar_url}
              username={user.full_name || user.username}
              size={76}
              editing={editing}
              onUpload={url => setForm(f => ({ ...f, avatar_url: url }))}
            />
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background:'rgba(212,168,67,0.1)', border:'1px solid rgba(212,168,67,0.3)', color:'#d4a843', transition:'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(212,168,67,0.2)'; (e.currentTarget as HTMLElement).style.transform='scale(1.05)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(212,168,67,0.1)'; (e.currentTarget as HTMLElement).style.transform='scale(1)' }}>
                <Edit2 className="w-3.5 h-3.5" /> Edit profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)}
                  className="px-3 py-2 rounded-xl text-xs transition-all"
                  style={{ background:'rgba(255,255,255,0.05)', color:'#7070a0', border:'1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(239,68,68,0.15)'; (e.currentTarget as HTMLElement).style.color='#ef4444' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color='#7070a0' }}>
                  <X className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-black transition-all hover:scale-105"
                  style={{ background:'linear-gradient(135deg, #d4a843, #f5e07a)' }}>
                  <Save className="w-3.5 h-3.5" />
                  {updateProfile.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {/* Name display — full_name primary, username secondary */}
          <div className="mb-4">
            {editing ? (
              <div className="mb-3">
                <label className="text-xs font-semibold mb-1.5 block" style={{ color:'#9090b0' }}>Display Name</label>
                <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Your full name" maxLength={60}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,168,67,0.3)', color:'white' }} />
              </div>
            ) : (
              <>
                {/* Full name — big display */}
                <h2 className="text-xl font-black text-white mb-0.5">
                  {user.full_name ? <Gold>{user.full_name}</Gold> : <Gold>{user.username}</Gold>}
                </h2>
                {/* Username — smaller, no @ prefix */}
                <div className="flex items-center gap-1.5 mb-2">
                  <AtSign className="w-3 h-3" style={{ color:'#50508a' }} />
                  <span className="text-sm font-medium" style={{ color:'#60608a' }}>{user.username}</span>
                </div>
              </>
            )}
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-xs" style={{ color:'#50508a' }}>
                <Mail className="w-3 h-3" />{user.email}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color:'#50508a' }}>
                <Calendar className="w-3 h-3" />Joined {formatDate(user.created_at)}
              </span>
            </div>
          </div>

          {/* Bio */}
          {editing ? (
            <div className="mb-4">
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'#9090b0' }}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Tell people what you're about..." maxLength={200} rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,168,67,0.3)', color:'white' }} />
              <p className="text-xs mt-1 text-right" style={{ color:'#50508a' }}>{form.bio.length}/200</p>
            </div>
          ) : (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: user.bio ? '#c0c0d8' : '#40406a' }}>
              {user.bio || 'No bio yet — click Edit to add one.'}
            </p>
          )}

          {/* Social */}
          {editing ? (
            <div className="space-y-3">
              {[
                { key:'twitter',  icon:Twitter,  placeholder:'@username',           label:'Twitter / X' },
                { key:'linkedin', icon:Linkedin, placeholder:'linkedin.com/in/...', label:'LinkedIn' },
                { key:'github',   icon:Github,   placeholder:'github.com/username', label:'GitHub' },
              ].map(({ key, icon:Icon, placeholder, label }) => (
                <div key={key}>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color:'#9090b0' }}>{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#50508a' }} />
                    <input value={(form as Record<string,string>)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'white' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.twitter && (
                <a href={`https://twitter.com/${user.twitter.replace('@','')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:scale-105 transition-all"
                  style={{ background:'rgba(29,161,242,0.1)', border:'1px solid rgba(29,161,242,0.2)', color:'#1da1f2' }}>
                  <Twitter className="w-3.5 h-3.5" />{user.twitter}
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:scale-105 transition-all"
                  style={{ background:'rgba(10,102,194,0.1)', border:'1px solid rgba(10,102,194,0.2)', color:'#0a66c2' }}>
                  <Linkedin className="w-3.5 h-3.5" />LinkedIn
                </a>
              )}
              {user.github && (
                <a href={user.github.startsWith('http') ? user.github : `https://${user.github}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:scale-105 transition-all"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#e0e0f0' }}>
                  <Github className="w-3.5 h-3.5" />GitHub
                </a>
              )}
              {!user.twitter && !user.linkedin && !user.github && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color:'#40406a' }}>
                  <Globe className="w-3.5 h-3.5" />No social links yet
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Username change card */}
      <div className="rounded-2xl p-5" style={{ background:'#0d0d1a', border:'1px solid rgba(212,168,67,0.15)' }}>
        <div className="flex items-center gap-2 mb-3">
          <UserIcon className="w-4 h-4" style={{ color:'#d4a843' }} />
          <h3 className="font-bold text-white text-sm">Username</h3>
          <span className="text-xs ml-auto px-2 py-0.5 rounded-lg"
            style={{ background: canChangeUsername ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: canChangeUsername ? '#10b981' : '#ef4444', border: `1px solid ${canChangeUsername ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            {limit - changesThisMonth}/{limit} changes left
            
          </span>
          
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl mb-3" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
        <AtSign className="w-4 h-4 shrink-0" style={{ color:'#50508a' }} />

        {editing ? (
          <input
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            disabled={!canChangeUsername}
            className="bg-transparent outline-none text-sm font-mono font-bold text-white w-full"
            placeholder="Enter username"
          />
        ) : (
          <span className="text-sm font-mono font-bold text-white">
            {user.username}
          </span>
        )}
        
      </div>
        <p className="text-xs" style={{ color:'#50508a' }}>
          Username can be changed max {limit} times per month. Go to Settings to change.
        </p>
      </div>
      {/* Interests */}
      <div className="rounded-2xl p-5" style={{ background:'#0d0d1a', border:'1px solid rgba(212,168,67,0.15)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4" style={{ color:'#d4a843' }} />
          <h3 className="font-bold text-white text-sm">Reading Interests</h3>
          <span className="text-xs ml-auto" style={{ color:'#50508a' }}>{user.interests.length} active</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.interests.map(interest => (
            <div key={interest} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all cursor-default"
              style={{ background:`${categoryColors[interest]||'#6366f1'}15`, border:`1px solid ${categoryColors[interest]||'#6366f1'}40`, color:categoryColors[interest]||'#6366f1' }}>
              {interest}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Member since', value: new Date(user.created_at).getFullYear().toString() },
          { label:'Interests',    value: user.interests.length.toString() },
          { label:'Status',       value: 'Active' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-4 text-center" style={{ background:'#0d0d1a', border:'1px solid rgba(212,168,67,0.1)' }}>
            <p className="text-xl font-black mb-0.5" style={{ color:'#d4a843' }}>{value}</p>
            <p className="text-xs" style={{ color:'#50508a' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}