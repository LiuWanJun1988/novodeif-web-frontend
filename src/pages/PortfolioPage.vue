<template>
  <div :class="$style.page">
    <div :class="$style.page__container">
      <FollowNovo :class="$style.page__follow" />
      <div :class="$style.page__stats">
        <TheStats />
      </div>
      <div :class="$style.page__transactions">
        <h3 :class="$style.page__title">Transactions</h3>
        <p :class="$style.page__text">
          We do our best to sift through all transactions and only find Novo
          related ones.
        </p>
        <TheTransactions :class="$style.page__table" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheStats from '~/components/common/TheStats.vue'
import FollowNovo from '~/components/ui/FollowNovo.vue'
import TheTransactions from '~/components/common/TheTransactions.vue'

export default defineComponent({
  name: 'PortfolioPage',
  components: { TheStats, FollowNovo, TheTransactions },
  setup() {
    const rows = Array(10)
      .fill({
        icon: '',
        type: '',
        bnb: '',
        novo: '',
        return: '',
        amount: '',
        isSwap: false,
      })
      .map((_, i) => {
        const types = ['Swap', 'Stake']
        const icons = ['icon-shield', 'icon-swap']
        const type = Math.round(Math.random())
        return {
          id: i,
          isSwap: !!type,
          type: types[type],
          icon: icons[type],
          bnb: '1.5 BNB',
          novo: '4,195,312 NOVO',
          from: '0x1CAA12DBc2da0c825247dFCCC444b003a89cB4aA',
          to: '0xE8761A412C826C9B9E00454874dc3558E986aAcD',
          return: `${(Math.random() * 100).toFixed(2)}%`,
          amount: '$512 USD',
        }
      })

    return { rows }
  },
})
</script>

<style lang="scss" module>
.page {
  max-width: 1194px;
  margin: 0 auto;

  &__container {
    position: relative;
    padding: 38px;

    @include media($to: sm) {
      padding: 40px 24px;
    }

    @include media($to: xs) {
      padding: 40px 16px;
    }
  }

  &__follow {
    margin-bottom: 30px;
  }

  &__stats {
    margin-bottom: 45px;
    overflow: hidden;
  }

  &__title {
    margin-bottom: 7px;
    font-size: 16px;
    line-height: 17px;
    letter-spacing: 0.22px;
  }

  &__text {
    margin-bottom: 32px;
    color: var(--profile-text);
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.02px;
  }
}
</style>
