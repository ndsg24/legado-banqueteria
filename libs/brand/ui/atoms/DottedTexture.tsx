import { useState } from 'react'
import '../../styles/dotted-texture.css'

function randomPosition() {
  // Align each pulse with a cell of the 9px background grid.
  return `round(down, ${Math.random() * 100}%, 9px)`
}

export function DottedTexture() {
  const [dots] = useState(() =>
    Array.from({ length: 120 }, () => {
      const duration = 4 + Math.random() * 5
      return {
        left: randomPosition(),
        top: randomPosition(),
        animationDuration: duration + 's',
        animationDelay: -Math.random() * duration + 's',
      }
    }),
  )

  return (
    <div className="dotted-texture" aria-hidden="true">
      {dots.map((style, index) => (
        <span
          key={index}
          style={style}
          onAnimationIteration={({ currentTarget }) => {
            currentTarget.style.left = randomPosition()
            currentTarget.style.top = randomPosition()
          }}
        />
      ))}
    </div>
  )
}
