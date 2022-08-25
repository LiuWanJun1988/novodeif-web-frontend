export enum Theme {
  DARK = 'is-dark',
  LIGHT = 'is-light',
}

export type ButtonType = 'button' | 'submit'
export type ButtonSize = 'sm' | 'md' | 'xmd' | 'lg'
export type ButtonUI =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'secondary-stroke'
  | 'stroke'
  | 'stroke-orange'
  | 'tertiary'

export interface Tab {
  page: string
  text: string
  disabled: () => boolean
}

export type Text = 'title' | 'description'
