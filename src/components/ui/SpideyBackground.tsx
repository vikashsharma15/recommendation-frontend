interface Props {
  position?: 'center' | 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right'
  opacity?: number
  size?: number
}

export default function SpideyBackground({
  position = 'center',
  opacity = 0.06,
  size = 500,
}: Props) {
  const posStyles: Record<string, React.CSSProperties> = {
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    'top-right': { top: '-5%', right: '-5%' },
    'top-left': { top: '-5%', left: '-5%' },
    'bottom-right': { bottom: '-5%', right: '-5%' },
    'bottom-left': { bottom: '-5%', left: '-5%' },
  }

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        ...posStyles[position],
        width: size,
        height: size,
        opacity,
        zIndex: 1,
      }}
    >
      <img
        src="/spiderchat.png"
        alt=""
        className="w-full h-full object-contain"
        style={{ filter: 'saturate(0.6) brightness(0.8)' }}
      />
    </div>
  )
}