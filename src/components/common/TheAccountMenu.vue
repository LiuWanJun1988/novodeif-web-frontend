<template>
  <div :class="$style.nav">
    <div :class="$style.nav__container">
      <div :class="$style.nav__main">
        <button
          type="button"
          :class="$style.nav__close"
          @click="$emit('close')"
        >
          <BaseIcon name="icon-close" :class="$style.nav__closeIcon" />
        </button>
        <div :class="$style.nav__account">
          <UserAvatar :class="$style.nav__avatar" />
          <div :class="$style.nav__info">
            <div :class="$style.nav__title">{{ list[0].price }}</div>
            <div :class="$style.nav__meta">
              {{ getters.selectedAccountShort.value }}
            </div>
          </div>
        </div>
        <ul :class="$style.nav__list">
          <li v-for="item in list" :key="item.id" :class="$style.nav__item">
            <div :class="$style.nav__label">
              <BaseIcon :name="item.icon" :class="$style.nav__icon" />
              <div :class="$style.nav__subtitle">
                {{ item.title }}
              </div>
            </div>
            <div :class="$style.nav__content">
              <div :class="$style.nav__amount">
                {{ item.amount }}
              </div>
              <div :class="$style.nav__price">
                {{ item.price }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div :class="$style.nav__footer">
        <BaseButton
          size="xmd"
          ui="stroke"
          :class="$style.nav__button"
          block
          @click="buywithNovoPay"
        >
          Buy with Novo Pay
        </BaseButton>
        <BaseButton
          size="xmd"
          ui="stroke-orange"
          :class="$style.nav__button"
          @click="buyOnPCS"
          block
        >
          <img src="/images/cake.png" :class="$style.nav__cake" />
          Buy on PCS
        </BaseButton>
      </div>
    </div>
    <BaseButton
      ui="default"
      size="xmd"
      :class="$style.nav__disconnect"
      @click="disconnect"
    >
      Disconnect
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from '~/store'
import UserAvatar from '../ui/UserAvatar.vue'
import BaseIcon from '../ui/BaseIcon.vue'
import BaseButton from '../ui/BaseButton.vue'
import { convertToNovo, convertToUSD } from '~/helpers/convertToCurrency'
import { tokenContractAddress } from '~/constants/addresses'

export default defineComponent({
  name: 'TheAccountMenu',
  components: { UserAvatar, BaseIcon, BaseButton },
  emits: {
    close: null,
  },
  methods: {
    buyOnPCS() {
      window.open(
        'https://pancakeswap.finance/swap?outputCurrency=' +
          tokenContractAddress,
        '_blank'
      )
    },
    buywithNovoPay() {
      // window.location.href = '/buy-novo';
    },
    disconnect() {
      this.methods.disconnect()
      this.$router.push({ name: 'Dashboard' })
    },
  },
  created() {
    fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=novo-token&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    )
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) {
          const error = (data && data.message) || response.statusText
          return Promise.reject(error)
        }
        Promise.all(
          data.map((item: { [x: string]: string }) => {
            const currentPrice = parseFloat(item['current_price'])
            this.currentPrice = currentPrice
          })
        )
      })
      .catch((error) => {
        console.error('There was an error!', error)
      })
  },
  setup() {
    const { getters, methods } = useStore()

    const list = computed(() => [
      {
        id: 1,
        icon: 'icon-logo-circle',
        title: 'NOVO',
        amount: convertToNovo(getters.selectedBalance.value),
        price: convertToUSD(currentPrice.value * getters.selectedBalance.value),
      },
      // {
      //   id: 2,
      //   icon: 'icon-logo-circle-yellow',
      //   title: 'NOVOx',
      //   amount: '0',
      //   price: '$0',
      // },
    ])

    const currentPrice = ref(0)

    return {
      getters,
      methods,
      list,
      currentPrice,
      convertToNovo,
      convertToUSD,
    }
  },
})
</script>

<style lang="scss" module>
.nav {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 320px;
  max-width: 466px;
  padding-bottom: 24px;
  overflow: auto;
  background: var(--account-menu-background);
  border: 1px solid var(--account-menu-border);
  box-shadow: -50px 0 40px 0 rgb(var(--account-menu-shadow) / 0.21);

  &__container {
    flex: 1 1 auto;
    width: 100%;
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 27px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    color: inherit;
    background: none;
  }

  &__closeIcon {
    font-size: 14px;
  }

  &__main {
    position: relative;
    padding: 35px 40px 30px;

    @include media($to: xxs) {
      padding: 35px 20px;
    }
  }

  &__account {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }

  &__avatar {
    flex: 0 0 auto;
    margin-right: 10px;
    font-size: 37px;
  }

  &__info {
    flex: 1 1 auto;
  }

  &__title {
    margin-bottom: 5px;
    font-weight: 700;
    font-size: 19px;
    letter-spacing: 0.26px;
  }

  &__meta {
    color: var(--account-menu-meta-color);
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
  }

  &__item {
    display: flex;
    align-items: flex-start;

    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  &__label {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
  }

  &__icon {
    flex: 0 0 auto;
    margin-right: 13px;
    font-size: 28px;
  }

  &__content {
    flex: 1 1 auto;
    text-align: right;
  }

  &__subtitle,
  &__amount {
    font-weight: 700;
    font-size: 15px;
    line-height: 16px;
    letter-spacing: 0.21px;
  }

  &__price {
    margin-top: 6px;
    color: var(--account-menu-meta-color);
    font-weight: 700;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.17px;
  }

  &__footer {
    padding: 26px 40px;
    border-top: 1px solid var(--account-menu-line);

    @include media($from: 450px) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    @include media($to: xxs) {
      padding: 25px 20px;
    }
  }

  &__button {
    @include media($from: 450px) {
      max-width: calc(50% - 8px);
    }

    @include media($to: 449px) {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }

  &__cake {
    height: 26px;
    margin-right: 11px;
  }

  &__disconnect {
    flex: 0 0 auto;
    width: 140px;
  }
}
</style>
