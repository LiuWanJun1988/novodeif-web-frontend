<template>
  <transition
    :enter-active-class="$style.modal_active"
    :leave-active-class="$style.modal_active"
    :enter-from-class="$style.modal_inactive"
    :leave-to-class="$style.modal_inactive"
  >
    <div v-if="isOpened" :class="$style.modal">
      <div
        ref="containerRef"
        :class="[$style.modal__container, containerClassList]"
      >
        <button
          v-if="!hideCloseButton"
          type="button"
          :class="$style.modal__close"
          @click="close"
        >
          <BaseIcon name="icon-close" :class="$style.modal__icon" />
        </button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import useOpened from '~/composables/useOpened'
import BaseIcon from './BaseIcon.vue'

export default defineComponent({
  name: 'BaseModal',
  props: {
    hideCloseButton: {
      type: Boolean,
      default: false,
    },
    containerClassList: {
      type: null,
      default: null,
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
  components: { BaseIcon },
})
</script>

<style lang="scss" module>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 320px;
  padding: 40px 20px;
  overflow: auto;
  transition: opacity 0.3s, visibility 0.3s;

  &_inactive {
    visibility: hidden;
    opacity: 0;
  }

  &_active {
    transition: opacity 0.3s, visibility 0.3s;
  }

  &__container {
    position: relative;
    max-width: 600px;
    margin: auto;
    overflow: hidden;
    background: var(--modal-background);
    border-radius: 10px;
    box-shadow: 0 0 40px 0 rgb(var(--modal-shadow) / 0.21);
  }

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    color: inherit;
    background: none;
    border-radius: 50%;

    @include media($to: sm) {
      top: 14px;
      right: 20px;
    }
  }

  &__icon {
    width: 1em;
    height: 1em;
    font-size: 16px;
    fill: currentColor;
  }
}
</style>
