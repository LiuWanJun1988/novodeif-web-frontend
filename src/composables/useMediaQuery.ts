import { ref, Ref } from 'vue'

export function useMediaQuery(query: string): Ref<boolean> {
  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  const onChange = (e: MediaQueryListEvent) => {
    matches.value = e.matches
  }

  if ('addEventListener' in mediaQuery) {
    mediaQuery.addEventListener('change', onChange)
  } else {
    mediaQuery.addListener(onChange)
  }

  return matches
}
