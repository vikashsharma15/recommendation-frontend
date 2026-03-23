// Reusable web spinner — login/register submit pe use karo
export function WebSpinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 40 40" fill="none"
      className="animate-spin" style={{ animationDuration: '1.5s' }}>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i/8)*Math.PI*2
        return <line key={i} x1="20" y1="20"
          x2={20+Math.cos(a)*17} y2={20+Math.sin(a)*17}
          stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      })}
      {[6,11,16].map(r => (
        <circle key={r} cx="20" cy="20" r={r}
          fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
      ))}
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  )
}

// Full page overlay loader — route transition pe
export function PageTransitionLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'rgba(6,6,14,0.95)', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.15s ease' }}>
      <div className="relative">
        {/* Outer ring */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
          className="animate-spin" style={{ animationDuration: '3s' }}>
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
            const a = (i/12)*Math.PI*2
            return <line key={i} x1="40" y1="40"
              x2={40+Math.cos(a)*36} y2={40+Math.sin(a)*36}
              stroke="#d4a843" strokeWidth="0.8" strokeOpacity="0.4" />
          })}
          {[12,22,32].map(r => (
            <circle key={r} cx="40" cy="40" r={r}
              fill="none" stroke="#d4a843" strokeWidth="0.8" strokeOpacity="0.3" />
          ))}
        </svg>
        {/* Center spider logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/spiderchat.png" alt=""
            style={{ width: 32, height: 32, filter: 'sepia(1) saturate(3)', objectFit: 'contain' }} />
        </div>
      </div>
      <p className="mt-4 text-xs font-black tracking-widest uppercase" style={{ color: '#d4a843' }}>
        Loading...
      </p>
      <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
    </div>
  )
}