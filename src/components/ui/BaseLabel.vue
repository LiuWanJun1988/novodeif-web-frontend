<template>
  <component :is="tag" :class="$style.label">
    <BaseIcon name="icon-shield" :class="$style.label__icon" />
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseIcon from './BaseIcon.vue'

export default defineComponent({
  name: 'BaseText',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },
  components: { BaseIcon },
})
</script>

<style lang="scss" module>
.label {
  position: relative;
  padding: 3px 0 0 23px;
  color: var(--label-color);
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.37px;

  &__icon {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--label-icon);
    font-size: 15px;
  }
}
</style>
