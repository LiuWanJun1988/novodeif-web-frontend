<template>
  <button type="button" :class="$style.button" @click="onClick">
    <BaseIcon :name="icon" :class="$style.button__icon" />
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '~/store'
import { Theme } from '~/types/common'
import BaseIcon from '../ui/BaseIcon.vue'

export default defineComponent({
  name: 'TheThemeButton',
  components: { BaseIcon },
  setup() {
    const { state, methods } = useStore()

    const icon = computed(() =>
      state.theme === Theme.LIGHT ? 'icon-moon' : 'icon-sun'
    )

    const oppositeTheme = computed(() =>
      state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    )

    const onClick = () => methods.setTheme(oppositeTheme.value)

    return { icon, onClick }
  },
})
</script>

<style lang="scss" module>
.button {
  position: relative;
  width: 32px;
  height: 32px;
  background: var(--theme-button-background);
  border-radius: 2px;

  &__icon {
    color: var(--theme-button-color);
    font-size: 24px;
    transition: color 0.3s;
  }
}
</style>
