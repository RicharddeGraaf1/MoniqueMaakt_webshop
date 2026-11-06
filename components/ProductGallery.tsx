'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [selected, setSelected] = useState(0)

  return (
    <div>
      <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden shadow-sm border border-stone-100 relative">
        <Image
          src={images[selected]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3 mt-4">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Foto ${index + 1} bekijken`}
              className={`aspect-square bg-stone-100 rounded-lg overflow-hidden relative border-2 transition-colors ${index === selected ? 'border-primary' : 'border-transparent hover:border-stone-300'}`}
            >
              <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
