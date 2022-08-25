<template>
  <span :class="$style.avatar" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserAvatar',
})
</script>

<style lang="scss" module>
.avatar {
  position: relative;
  display: block;
  width: 1em;
  height: 1em;
  overflow: hidden;
  background: var(--header-accounts-avatar-primary);
  border-radius: 4px;

  &::before,
  &::after {
    position: absolute;
    content: '';
  }

  &::before {
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: var(--header-accounts-avatar-secondary);
    transform: rotate(-40deg) translateY(-5%);
    transform-origin: left bottom;
  }

  &::after {
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: var(--header-accounts-avatar-tertiary);
    transform: rotate(20deg) translate(80%, -25%);
    transform-origin: right top;
  }
}
</style>
