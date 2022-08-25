<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { themeId } from './constants'
import { isValidTheme } from './helpers/isValidTheme'
import DefaultLayout from './layouts/DefaultLayout.vue'
import { useStore } from './store'
import { Theme } from './types/common'

export default defineComponent({
  name: 'App',
  components: { DefaultLayout },
  setup() {
    const { state, methods } = useStore()
    const cachedTheme = localStorage.getItem(themeId)

    if (isValidTheme(cachedTheme)) {
      methods.setTheme(cachedTheme)
    } else {
      const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? Theme.DARK
        : Theme.LIGHT
      methods.setTheme(theme)
    }

    watch(
      () => state.theme,
      (theme: Theme, previousTheme: Theme | void) => {
        if (previousTheme) document.body.classList.remove(previousTheme)
        document.body.classList.add(theme)
      },
      {
        immediate: true,
      }
    )

    methods.authorize().then(() => {
      state.provider.onChange(methods.setAccounts)
    })
  },
})
</script>
