import { useMemo, useRef, useState } from 'react'

type InputProps = {
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export const Input = ({ label, value, onChange, placeholder }: InputProps) => {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const minHeightPx = 83
  const imageSizeProportion = 3.217
  const minWidthPx = minHeightPx * imageSizeProportion

  const backgroundClass = useMemo(() => {
    return focused
      ? "bg-[url('../assets/paintedui/Button_2_Clicked_White.PNG')]"
      : "bg-[url('../assets/paintedui/Button_2_Normal.PNG')]"
  }, [focused])

  return (
    <div className="block relative">
      {label && <label className="absolute top-0 font-semibold text-sm">{label}</label>}
      <div
        className={`${backgroundClass} bg-no-repeat bg-center bg-contain flex items-center cursor-text mt-4`}
        style={{
          width: minWidthPx,
          height: minHeightPx,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-black text-sm text-center font-semibold placeholder:text-gray-400"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  )
}
