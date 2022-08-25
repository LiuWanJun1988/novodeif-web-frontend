<template>
  <BaseModal ref="modalRef" :class="$style.modal">
    <div :class="$style.modal__header">Confirm Swap</div>
    <div :class="$style.modal__body">
      <BaseIcon name="icon-exclamation" :class="$style.modal__icon" />
      <p :class="$style.modal__text">
        {{ getters.errorMessage.value }}
      </p>
      <BaseButton @click="close"> Dismiss</BaseButton>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseIcon from '../ui/BaseIcon.vue'
import { emitter } from '~/services/emitter'
import BaseButton from '../ui/BaseButton.vue'
import { useStore } from '~/store'

export default defineComponent({
  name: 'ModalConfirmSwap',
  components: { BaseModal, BaseIcon, BaseButton },
  setup() {
    const modalRef = ref()
    const { getters } = useStore()

    const open = () => modalRef.value?.open()
    const close = () => modalRef.value?.close()

    onMounted(() => {
      emitter.on('confirmSwap:open', open)
      emitter.on('confirmSwap:close', close)
    })

    onUnmounted(() => {
      emitter.off('confirmSwap:open', open)
      emitter.off('confirmSwap:close', close)
    })

    return { modalRef, getters, close }
  },
})
</script>

<style lang="scss" module>
.modal {
  &__header {
    position: relative;
    padding: 24px 50px 24px 24px;
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
    background: var(--modal-header);
  }

  &__body {
    padding: 36px 24px;
    color: var(--danger);
    text-align: center;
  }

  &__icon {
    margin-bottom: 16px;
    font-size: 54px;
  }

  &__text {
    font-size: 14px;

    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }
}
</style>
