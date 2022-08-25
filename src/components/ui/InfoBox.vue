<template>
  <div :class="$style.info">
    <slot :classList="$style.info__section" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InfoBox',
})
</script>

<style lang="scss" module>
.info {
  padding: 26px 16px 34px;
  background: var(--info-box-background);
  border: 1px solid var(--info-box-border);
  border-radius: 3px;

  &__section:not(:last-child) {
    margin-bottom: 33px;
  }
}
</style>
