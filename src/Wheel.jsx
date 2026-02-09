import { useRef, useState, useEffect } from 'react'
import './Game.css'

// Wheel component: renders a circular wheel with segments and spins to a random segment.
// props:
// - items: array of items (used only for count and labels)
// - onLand(index): called when the wheel finishes spinning and lands on a segment index
// - disabled: if true, disables the spin button
function Wheel({ items = [], onLand, disabled = false }) {
  const wheelRef = useRef(null)
  const [spinning, setSpinning] = useState(false)
  const segments = items.length || 1

  useEffect(() => {
    // Reset wheel rotation when items or disabled change
    if (wheelRef.current && !spinning) {
      wheelRef.current.style.transition = 'none'
      wheelRef.current.style.transform = `rotate(0deg)`
    }
  }, [items, spinning])

  const spin = () => {
    if (spinning || disabled) return
    const targetIndex = Math.floor(Math.random() * segments)
    const segmentAngle = 360 / segments

    // Add some full rotations for effect
    const fullRotations = 6
    // Calculate the target rotation so the chosen segment lands at the top pointer (0deg)
    // We offset by half a segment so the segment center lines up
    const randomOffset = (segmentAngle / 2)
    const rotation = fullRotations * 360 + (segments - targetIndex) * segmentAngle - randomOffset

    setSpinning(true)
    if (wheelRef.current) {
      // Use smooth transition
      wheelRef.current.style.transition = 'transform 3s cubic-bezier(.2,.9,.2,1)'
      wheelRef.current.style.transform = `rotate(${rotation}deg)`

      const handleTransitionEnd = () => {
        setSpinning(false)
        wheelRef.current.removeEventListener('transitionend', handleTransitionEnd)
        // Land callback
        if (typeof onLand === 'function') onLand(targetIndex)
      }

      wheelRef.current.addEventListener('transitionend', handleTransitionEnd)
    }
  }

  return (
    <div className="wheel-ui">
      <div className="wheel-container">
        <div className="wheel" ref={wheelRef} aria-hidden>
          {items.map((it, i) => {
            const angle = (360 / segments) * i
            const segmentStyle = {
              transform: `rotate(${angle}deg) skewY(-${90 - 360 / segments}deg)`
            }
            return (
              <div key={i} className="segment" style={segmentStyle}>
                <div className="segment-label" style={{ transform: `skewY(${90 - 360 / segments}deg) rotate(${360 / segments / 2}deg)` }}>
                  {typeof it === 'string' ? it : (it.label || `#${i + 1}`)}
                </div>
              </div>
            )
          })}
        </div>
        <div className="wheel-pointer">▲</div>
      </div>

      <button className="spin-button" onClick={spin} disabled={spinning || disabled}>
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  )
}

export default Wheel
