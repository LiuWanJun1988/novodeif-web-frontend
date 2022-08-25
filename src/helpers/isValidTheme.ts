import { Theme } from '~/types/common'

export const isValidTheme = (theme: string | null): theme is Theme =>
  [Theme.DARK, Theme.LIGHT].includes(theme as Theme)
