import { ReactNode, useMemo, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { ButtonVariant, SizeSpecificSettings } from './Button.types'
import { BACKGROUND_RULES, BASE_RULES, BUTTON_VARIANTS } from './Button.constants'
import { exhaustiveTypeGuard } from '@/app/utils/typesafety/exhaustiveTypeGuard'

type InputProps = {
  children: ReactNode
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  variant?: ButtonVariant
}

const getVariantSpecificSettings = (variant: ButtonVariant): SizeSpecificSettings => {
  switch (variant) {
    case ButtonVariant.Small:
      return BUTTON_VARIANTS.small
    case ButtonVariant.Normal:
      return BUTTON_VARIANTS.normal
    case ButtonVariant.Large:
      return BUTTON_VARIANTS.large
    default:
      return exhaustiveTypeGuard(variant)
  }
}

export const Button = ({ children, onClick, variant = ButtonVariant.Normal }: InputProps) => {
  const [hovered, setHovered] = useState(false)
  const buttonVariant = getVariantSpecificSettings(variant)

  const minHeightPx = 83 * buttonVariant.sizeModifier
  const imageSizeProportion = 3.217
  const minWidthPx = minHeightPx * imageSizeProportion

  const backgroundClass = useMemo(() => {
    return hovered
      ? "bg-[url('../assets/paintedui/Button_1_Clicked_White.PNG')]"
      : "bg-[url('../assets/paintedui/Button_1_Normal.PNG')]"
  }, [hovered])

  return (
    <div
      className={twJoin(
        `${backgroundClass} ${hovered ? 'text-black' : 'text-white'}`,
        BACKGROUND_RULES,
        BASE_RULES,
        buttonVariant.className
      )}
      style={{
        width: minWidthPx,
        height: minHeightPx,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  )
}
