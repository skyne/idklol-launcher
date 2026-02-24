import { useMemo, useRef, useState } from 'react'

type InputProps = {
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
}

export const Input = ({ label, value, onChange, placeholder, type = 'text' }: InputProps) => {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const minHeightPx = 83
  const imageSizeProportion = 3.35
  const minWidthPx = minHeightPx * imageSizeProportion

  const backgroundClass = useMemo(() => {
    return focused
      ? "bg-[url('../assets/paintedui/Button_2_Clicked_White.png')]"
      : "bg-[url('../assets/paintedui/Button_2_Normal.png')]"
  }, [focused])

  return (
    <div className="block relative">
      {label && <label className="absolute top-0 font-semibold text-sm">{label}</label>}
      <div
        className={`${backgroundClass} bg-no-repeat bg-center bg-contain flex items-center cursor-text mt-4 max-w-full`}
        style={{
          width: minWidthPx,
          height: minHeightPx,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-black text-sm text-center font-semibold placeholder:text-gray-400 px-6 overflow-hidden text-ellipsis whitespace-nowrap"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  )
}
