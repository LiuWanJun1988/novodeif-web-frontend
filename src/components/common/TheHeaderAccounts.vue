<template>
  <div :class="$style.accounts">
    <button
      ref="triggerRef"
      type="button"
      :class="$style.accounts__control"
      @click="open"
    >
      <UserAvatar :class="$style.accounts__avatar" />
      {{ getters.selectedAccountShort.value }}
      <BaseIcon name="icon-arrow-down" :class="$style.accounts__arrow" />
    </button>
    <transition
      :enter-active-class="$style.accounts__menu_active"
      :leave-active-class="$style.accounts__menu_active"
      :enter-from-class="$style.accounts__menu_inactive"
      :leave-to-class="$style.accounts__menu_inactive"
    >
      <TheAccountMenu
        v-if="isOpened"
        ref="menuRef"
        @close="close"
        :class="$style.accounts__menu"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { isElement } from '~/helpers/isElement'
import { useStore } from '~/store'
import BaseIcon from '../ui/BaseIcon.vue'
import UserAvatar from '../ui/UserAvatar.vue'
import TheAccountMenu from './TheAccountMenu.vue'

export default defineComponent({
  name: 'TheHeaderAccounts',
  components: { BaseIcon, UserAvatar, TheAccountMenu },
  setup() {
    const { getters } = useStore()

    const triggerRef = ref()
    const menuRef = ref()

    const isOpened = ref(false)

    const open = () => {
      isOpened.value = true
    }

    const close = () => {
      isOpened.value = false
    }

    const onDocumentClick = ({ target }: Event) => {
      const container = menuRef.value?.$el

      if (!isElement(container) || !isElement(target)) {
        close()
        return
      }

      if (
        [triggerRef.value, container].some(
          (el) => el.contains(target) || el === target
        )
      )
        return

      close()
    }

    watch(isOpened, (isOpened: boolean) => {
      if (isOpened) {
        document.addEventListener('click', onDocumentClick, true)
      } else {
        document.removeEventListener('click', onDocumentClick, true)
      }
    })

    return {
      getters,
      isOpened,
      open,
      close,
      triggerRef,
      menuRef,
    }
  },
})
</script>

<style lang="scss" module>
.accounts {
  position: relative;

  &__control {
    position: relative;
    display: block;
    width: 100%;
    height: 38px;
    padding: 2px 35px 0 43px;
    color: var(--header-accounts-color);
    font-weight: 600;
    font-size: 14px;
    line-height: normal;
    background: var(--header-accounts-background);
    border: 2px solid var(--header-accounts-border);
    border-radius: 3px;
  }

  .accounts__avatar {
    position: absolute;
    top: 1px;
    left: 1px;
    font-size: 32px;
  }

  &__arrow {
    position: absolute;
    top: 50%;
    right: 11px;
    margin-top: -0.5em;
    font-size: 7px;
  }

  &__menu {
    &_active {
      transition: transform 0.6s;
    }

    &_inactive {
      transform: translateX(120%);
    }
  }
}
</style>
