<template>
  <div :class="$style.card">
    <div :class="$style.card__figure">
      <BaseIcon name="icon-add-square" :class="$style.card__icon" />
    </div>
    <h2 :class="$style.card__title">No wallet connected</h2>
    <div :class="$style.card__text">A connection to BSC is required</div>
    <BaseButton
      ui="primary"
      size="sm"
      :class="$style.card__button"
      @click="openConnectWallet"
    >
      Connect Wallet
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseIcon from './BaseIcon.vue'
import BaseButton from './BaseButton.vue'
import { useStore } from '~/store'
import { emitter } from '~/services/emitter'

export default defineComponent({
  name: 'ConnectWalletCard',
  components: { BaseIcon, BaseButton },
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
  padding: 66px 24px;
  text-align: center;
  background: var(--connect-wallet-card-background);
  border: 1px solid var(--connect-wallet-card-border);
  border-radius: 7px;
  box-shadow: 0 4px 13px rgb(0 0 0 / 0.04);

  &__figure {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    color: var(--connect-wallet-card-figure-color);
    background: var(--connect-wallet-card-figure-background);
    border: 1px solid var(--connect-wallet-card-figure-border);
    border-radius: 50%;
  }

  &__icon {
    font-size: 24px;
  }

  &__title {
    margin-bottom: 7px;
    font-weight: 700;
    font-size: 16px;
    line-height: 17px;
    letter-spacing: 0.03px;
  }

  &__text {
    margin-bottom: 20px;
    color: var(--connect-wallet-card-text);
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 0.02px;
  }
}
</style>
