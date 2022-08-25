import { Tab } from '~/types/common'

export const isValidTabs = (tabs: unknown): tabs is Tab[] => Array.isArray(tabs)
