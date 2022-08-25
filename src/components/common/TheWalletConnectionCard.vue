<template>
  <div :class="$style.card">
    <div :class="$style.card__circles" />
    <div :class="$style.card__container">
      <BaseIcon name="icon-meta-mask" :class="$style.card__logo" />
      <BaseIcon name="icon-connect-wallet" :class="$style.card__logo" />
      <div :class="$style.card__title">Wallet Connection Required</div>
      <div :class="$style.card__text">
        In order to use the Novo ecosystem, a defi wallet connection is
        required.
      </div>
      <BaseButton
        block
        ui="secondary"
        size="md"
        :class="$style.card__button"
        @click="openConnectWallet"
      >
        Connect Wallet
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '~/store'
import { emitter } from '../../services/emitter'
import BaseButton from '../ui/BaseButton.vue'
import BaseIcon from '../ui/BaseIcon.vue'

export default defineComponent({
  name: 'TheWalletConnectionCard',
  components: { BaseButton, BaseIcon },
  methods: {
    openConnectWallet() {
      emitter.emit('connectWallet:open')
    },
  },
  setup() {
    const { methods } = useStore()
    return { methods }
  },
})
</script>

<style lang="scss" module>
.card {
  position: relative;
  overflow: hidden;
  background: #2a2146;
  border-radius: 8px;

  &__circles {
    position: absolute;
    right: 45px;
    bottom: 26px;
    width: 236px;
    height: 236px;
    background-image: linear-gradient(172deg, #4b303a 26%, #2a2146 75%);
    border-radius: 50%;

    &::before,
    &::after {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      content: '';
    }

    &::before {
      right: 22px;
      background-image: linear-gradient(182deg, #4e3339 19%, #2a2146 90%);
    }

    &::after {
      right: 40px;
      background-image: linear-gradient(135deg, #5d3833 0%, #2a2146 100%);
    }
  }

  &__container {
    position: relative;
    padding: 15px 18px 16px;
  }

  &__logo {
    display: inline-block;
    margin: 0 12px 12px 0;
    font-size: 32px;
    vertical-align: top;
  }

  &__title {
    margin-bottom: 10px;
    color: #fffdff;
    font-weight: 700;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.02px;
  }

  &__text {
    margin-bottom: 18px;
    color: #fff;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.02px;
  }
}
</style>
