<template>
  <component :is="tag" :class="$style[ui]">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Text } from '~/types/common'

export default defineComponent({
  name: 'BaseText',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    ui: {
      type: String as PropType<Text>,
      required: true,
    },
  },
})
</script>

<style lang="scss" module>
.title {
  font-weight: 700;
  font-size: 23px;
  line-height: 1;
  letter-spacing: -0.3px;
}

.description {
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.08px;
}
</style>
