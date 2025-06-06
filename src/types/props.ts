import type { AppColor, ButtonFill, IconSetType, IHrefTarget, IonicColor } from './common'

export interface AvatarProps {
  src: string
  shadow?: number
  top?: boolean
  fetchImage?: boolean
  rounded?: boolean
  round?: boolean
  square?: boolean
  size?: number
  ratio?: number
  imgBg?: string
  spinnerColor?: string
  bordered?: boolean
  borderedColor?: string
  borderedWidth?: string
  badge?: BadgeProps
}
export interface ButtonProps {
  color?: IonicColor;
  clear?: boolean;
  disabled?: boolean;
  expand?: 'block' | 'full';
  fill?: ButtonFill;
  full?: boolean;
  label?: string;
  href?: string;
  avatar?: AvatarProps;
  icon?: IconProps;
  iconRight?: IconProps;
  iconOnly?: boolean;
  target?: IHrefTarget;
  round?: boolean;
  outline?: boolean;
  size?: 'default' | 'large' | 'small';
  strong?: boolean;
  type?: 'button' | 'reset' | 'submit';
  to?: string;
  rbac?: RBACProps;
}
export interface IconProps {
  name: string
  iconSet?: IconSetType
  size?: number
  color?: AppColor | undefined
  additionalReplce?: string
}
export interface BadgeProps {
  color?: IonicColor;
  floating?: boolean
  rounded?: boolean
  transparent?: boolean
  text?: string
  textColor?: AppColor
  cssClass?: string
  cssStyle?: {
    [key: string]: string | number
  }
}
export interface RBACProps {
  permissions?: string[];
  condition?: 'any' | 'all' | 'not';
}