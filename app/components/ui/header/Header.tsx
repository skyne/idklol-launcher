import { useMemo, useRef } from 'react'

type HeaderProps = {
  title: string
}

type ContainerSize = {
  width: number
  height: number
}

export const Header = ({ title }: HeaderProps) => {
  const textRef = useRef<HTMLSpanElement>(null)

  const size = useMemo<ContainerSize>(() => {
    const imageSizeProportion = 7.768
    const minHeightPx = 56 * 1.5
    const minWidthPx = minHeightPx * imageSizeProportion
    if (!textRef.current) {
      return {
        width: minWidthPx,
        height: minHeightPx,
      }
    }
    const rect = textRef.current.getBoundingClientRect()
    const containerWidth = Math.max(minWidthPx, rect.width * 2)
    const containerHeight = Math.max(minHeightPx, containerWidth / imageSizeProportion)

    return {
      width: containerWidth,
      height: containerHeight,
    }
  }, [textRef])

  return (
    <div
      className="bg-[url(..\assets\paintedui\Sub_Heading_Slash_white.PNG)] bg-no-repeat bg-contain flex items-center px-8 z-1"
      style={{
        width: size?.width,
        height: size?.height,
      }}
    >
      <span ref={textRef} className="text-lg font-semibold text-black">
        {title}
      </span>
    </div>
  )
}
