<template>
  <BaseModal
    hide-close-button
    ref="modalRef"
    :class="$style.modal"
    :container-class-list="$style.modal__container"
  >
    <div :class="$style.modal__item" v-for="item in items" :key="item.id">
      <button type="button" :class="$style.modal__button" @click="item.onclick">
        <BaseIcon :name="item.icon" :class="$style.modal__icon" />
        <span :class="$style.modal__title">
          {{ item.title }}
        </span>
        <span :class="$style.modal__text">
          {{ item.text }}
        </span>
      </button>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { emitter } from '~/services/emitter'
import BaseModal from '../ui/BaseModal.vue'
import BaseIcon from '../ui/BaseIcon.vue'
import { useStore } from '../../store'

export default defineComponent({
  name: 'ModalConnectWallet',
  components: { BaseModal, BaseIcon },
  setup() {
    const modalRef = ref()
    const { methods } = useStore()

    const open = () => modalRef.value?.open()
    const close = () => modalRef.value?.close()

    onMounted(() => {
      emitter.on('connectWallet:open', open)
      emitter.on('connectWallet:close', close)
    })

    onUnmounted(() => {
      emitter.off('connectWallet:open', open)
      emitter.off('connectWallet:close', close)
    })

    const items = [
      {
        id: 1,
        icon: 'icon-meta-mask',
        title: 'MetaMask',
        text: 'Connect to your MetaMask Wallet',
        onclick: async () => {
          await methods.setProvider('metamask')
          await methods.connect()
          await methods.authorize()
          emitter.emit('connectWallet:close')
        },
      },
      {
        id: 1,
        icon: 'icon-connect-wallet',
        title: 'WalletConnect',
        text: 'Scan with WalletConnect to connect',
        onclick: async () => {
          await methods.setProvider('walletconnect')
          await methods.connect()
          await methods.authorize()
          emitter.emit('connectWallet:close')
        },
      },
    ]

    return { items, modalRef }
  },
})
</script>

<style lang="scss" module>
.modal {
  background: rgb(19 5 35 / 0.36);

  &__container {
    width: 100%;
    max-width: 500px;
    padding: 0 9px;
  }

  &__item {
    padding: 9px 0;
    border-bottom: 1px solid rgb(195 195 195 / 0.14);
  }

  &__button {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 24px 16px;
    background: none;
    border-radius: 12px;
    transition: background-color 0.2s ease-in-out 0s;

    @include hover {
      background: rgb(195 195 195 / 0.14);
    }
  }

  &__icon {
    margin: 0 auto 12px;
    font-size: 45px;
  }

  &__title {
    width: 100%;
    color: var(--text);
    font-weight: 700;
    font-size: 24px;

    @include media($to: xxs) {
      font-size: 18px;
    }
  }

  &__text {
    width: 100%;
    padding: 6px 0;
    color: rgb(169 169 188);
    font-weight: 700;
    font-size: 18px;

    @include media($to: xs) {
      font-size: 14px;
    }

    @include media($to: xxs) {
      font-size: 13px;
    }
  }
}
</style>
