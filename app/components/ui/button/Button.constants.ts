import { SizeSpecificSettings } from "./Button.types"

export const BACKGROUND_RULES = 'bg-no-repeat bg-center bg-contain'
export const BASE_RULES = 'inline-flex flex items-center cursor-pointer justify-center'

export const BUTTON_VARIANTS: {[key: string]: SizeSpecificSettings} = {
  small: {
    className: 'text-sm',
    sizeModifier: 0.4,
  },
  normal: {
    className: 'text-lg',
    sizeModifier: 0.7,
  },
  large: {
    className: 'text-xl',
    sizeModifier: 1,
  },
}