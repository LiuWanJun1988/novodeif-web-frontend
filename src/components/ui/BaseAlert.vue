<template>
  <transition
    :enter-active-class="$style.alert_active"
    :leave-active-class="$style.alert_active"
    :enter-from-class="$style.alert_inactive"
    :leave-to-class="$style.alert_inactive"
  >
    <div
      v-if="isOpened"
      ref="containerRef"
      :class="[
        $style.alert,
        {
          [$style.alert_pending]: ui === 'pending',
          [$style.alert_success]: ui === 'success',
          [$style.alert_danger]: ui === 'danger',
        },
      ]"
    >
      <button type="button" :class="$style.alert__close" @click="close">
        <BaseIcon name="icon-close" :class="$style.alert__icon" />
      </button>
      <slot />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import useOpened from '~/composables/useOpened'
import BaseIcon from './BaseIcon.vue'

export default defineComponent({
  name: 'BaseAlert',
  components: { BaseIcon },
  props: {
    ui: {
      type: String as PropType<'pending' | 'success' | 'danger'>,
      default: 'pending',
      validator: (ui: string) => ['pending', 'success', 'danger'].includes(ui),
    },
  },
  setup() {
    const containerRef = ref()
    const { open, close, toggle, isOpened } = useOpened({
      preventNodes: () => [containerRef.value],
    })

    return {
      open,
      close,
      toggle,
      isOpened,
      containerRef,
    }
  },
})
</script>

<style lang="scss" module>
.alert {
  position: absolute;
  top: 10px;
  left: 50%;
  width: calc(100% - 32px);
  max-width: 500px;
  padding: 12px 40px 12px 20px;
  font-size: 16px;
  border: 1px solid transparent;
  border-radius: 0.25em;
  transform: translateX(-50%);

  &_inactive {
    transform: translate(-50%, -100%);
    visibility: hidden;
    opacity: 0;
  }

  &_active {
    transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
  }

  &_pending {
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;
  }

  &_success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }

  &_danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
  }

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    color: inherit;
    background: none;
  }

  &__icon {
    font-size: 14px;
  }
}
</style>
