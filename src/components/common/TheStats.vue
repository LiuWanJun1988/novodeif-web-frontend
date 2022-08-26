<template>
  <div :class="$style.stats">
    <div :class="[$style.stats__item, $style.stats__item_main]">
      <div :class="$style.stats__label">TOTAL BALANCE</div>
      <div :class="$style.stats__sum">
        {{ convertToUSD(portfolioInfo.totalBalance[1]) }}
        <div :class="$style.stats__sticker">Novo</div>
      </div>
      <div :class="$style.stats__result">
        <span> {{ convertToUSD(portfolioInfo.currentPrice, 5) }} </span>
        <strong
          :class="portfolioInfo.profit < 0 ? $style.stats__result__loss : ''"
        >
          ({{ convertToUSD(portfolioInfo.profit) }}
          {{ portfolioInfo.profit < 0 ? 'Loss' : 'Profit' }})
        </strong>
      </div>
    </div>
    <div v-for="item in items" :key="item.id" :class="$style.stats__item">
      <div :class="$style.stats__label">
        {{ item.label }}
      </div>
      <div :class="$style.stats__sum">{{ item.sum }}</div>
      <div :class="$style.stats__result">
        <strong>
          {{ item.value }}
        </strong>
        <span>
          {{ item.units }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ethers } from 'ethers'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { convertToUSD } from '~/helpers/convertToCurrency'
import {
  tokenContractAddress,
  tokenPairAddress,
} from '../../constants/addresses'
import { useStore } from '../../store'

export default defineComponent({
  name: 'TheStats',
  data: () => ({
    totalSupply: 0,
  }),
  created() {
    const { methods } = useStore()
    const bscScanUrl = 'api.bscscan.com'
    const owner = this.getters.selectedAccount.value
    const getStakeInfo = async () => {
      const currentStake = await methods
        .getNcosContract()
        .getStakingStatusByAddress(this.getters.selectedAccount.value)
      const principalBalance = Number(
        ethers.utils.formatUnits(currentStake.stakeInfo.principalBalance, 9)
      )
      const reward =
        Number(
          ethers.utils.formatUnits(currentStake.stakeInfo.bagSizeReward, 9)
        ) +
        Number(
          ethers.utils.formatUnits(currentStake.stakeInfo.stakingTimeReward, 9)
        )
      this.totalStaked = principalBalance
      this.totalRewards = reward
    }

    getStakeInfo()

    fetch(
      'https://api.dexscreener.com/latest/dex/pairs/bsc/' + tokenPairAddress
    )
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) {
          const error = (data && data.message) || response.statusText
          return Promise.reject(error)
        }
        this.currentPrice = parseFloat(data.pair.priceUsd)
        this.totalSupply = 1000000000.0
      })
      .catch((error) => {
        console.error('There was an error!', error)
      })

    this.fiatInvestment = 0.0
    // fetch(
    //   `https://${bscScanUrl}/api?module=account&action=tokentx&contractaddress=${tokenContractAddress}&address=${owner}&page=1&offset=500&startblock=0&endblock=999999999&sort=asc&apikey=7BMPA4TJFJW6G9PBP21H9X2K6I7KBESXZR`
    // )
    //   .then(async (response) => {
    //     const data = await response.json()
    //     if (!response.ok) {
    //       const error = (data && data.message) || response.statusText
    //       return Promise.reject(error)
    //     }

    //     const historicalPricePromises: Record<string, Promise<any>> = {}
    //     const firstHistoricalPriceData = new Date(1643324400 * 1000) // 28th of January 2022

    //     data.result.map((d: any) => {
    //       let timestamp = new Date(parseInt(d.timeStamp) * 1000)
    //       if (timestamp < firstHistoricalPriceData) {
    //         timestamp = firstHistoricalPriceData
    //       }
    //       d.formattedTimestamp = `${timestamp.getDate()}-${
    //         timestamp.getMonth() + 1
    //       }-${timestamp.getFullYear()}`
    //       if (historicalPricePromises[d.formattedTimestamp] == null) {
    //         historicalPricePromises[d.formattedTimestamp] = fetch(
    //           `https://api.coingecko.com/api/v3/coins/novo-token/history?date=${d.formattedTimestamp}`
    //         )
    //           .then(async (response) => {
    //             const historicalData = await response.json()
    //             if (!response.ok) {
    //               const error =
    //                 (historicalData && historicalData.message) ||
    //                 response.statusText
    //               return Promise.reject(error)
    //             }
    //             return historicalData.market_data.current_price.usd
    //           })
    //           .catch((error) => {
    //             console.error('There was an error!', error)
    //           })
    //       }
    //     })

    //     await Promise.all(Object.values(historicalPricePromises))

    //     data.result.map(async (d: any) => {
    //       const fiatValueOfNovoTokens =
    //         (d.value / 10 ** d.tokenDecimal) *
    //         (await historicalPricePromises[d.formattedTimestamp])
    //       this.fiatInvestment +=
    //         d.from == owner ? -fiatValueOfNovoTokens : fiatValueOfNovoTokens
    //     })
    //   })
    //   .catch((error) => {
    //     console.error('There was an error!', error)
    //   })
  },
  computed: {
    items() {
      return [
        {
          id: 'FIAT INVESTMENT',
          label: 'FIAT INVESTMENT',
          sum: convertToUSD(this.portfolioInfo.fiatVolume),
          value: convertToUSD(
            this.portfolioInfo.fiatVolume / this.portfolioInfo.totalBalance[0],
            5
          ),
          units: 'Avg',
        },
        {
          id: 'APPRECIATION',
          label: 'APPRECIATION',
          sum: convertToUSD(this.portfolioInfo.appreciation),
          value: `${Math.round(
            (this.portfolioInfo.appreciation / this.portfolioInfo.fiatVolume) *
              100
          )}%`,
          units: 'ROI',
        },
        {
          id: 'STAKING REWARDS',
          label: 'STAKING REWARDS',
          sum: convertToUSD(this.totalRewards * this.currentPrice),
          value: `${Math.round((this.totalRewards / this.totalStaked) * 100)}%`,
          units: 'ROI',
        },
        {
          id: 'TOTAL ROI',
          label: 'TOTAL ROI',
          sum: convertToUSD(
            this.totalRewards + this.portfolioInfo.appreciation
          ),
          value: `${
            Math.round((this.totalRewards / this.totalStaked) * 100) +
            Math.round(
              (this.portfolioInfo.appreciation /
                this.portfolioInfo.fiatVolume) *
                100
            )
          }%`,
          units: 'ROI',
        },
      ]
    },
  },
  setup() {
    const { getters, methods } = useStore()

    const currentPrice = ref(0)
    const fiatInvestment = ref(0)
    const totalStaked = ref(0)
    const totalRewards = ref(0)

    const portfolioInfo = computed(() => {
      console.log([
        getters.selectedBalance.value,
        totalStaked.value,
        totalRewards.value,
        currentPrice.value,
        fiatInvestment.value,
      ])
      return {
        totalBalance: [
          getters.selectedBalance.value,
          getters.selectedBalance.value * currentPrice.value,
        ],
        currentPrice: currentPrice.value,
        fiatVolume: fiatInvestment.value,
        profit:
          (getters.selectedBalance.value +
            totalStaked.value +
            totalRewards.value) *
            currentPrice.value -
          fiatInvestment.value,
        appreciation:
          (getters.selectedBalance.value +
            totalStaked.value +
            totalRewards.value) *
            currentPrice.value -
          fiatInvestment.value,
      }
    })

    onMounted(async () => {
      await methods.setAllowance(getters.selectedAccount.value)
    })

    watch(currentPrice, (currentPrice: number) => {
      portfolioInfo.value.currentPrice = currentPrice
    })

    return {
      convertToUSD,
      portfolioInfo,
      fiatInvestment,
      currentPrice,
      totalStaked,
      totalRewards,
      getters,
    }
  },
})
</script>

<style lang="scss" module>
.stats {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin: -50px;

  @include media($to: xl) {
    margin: -25px;
  }

  &__item {
    position: relative;
    flex: 0 0 auto;
    max-width: 100%;
    padding: 50px;
    overflow: hidden;

    @include media($to: xl) {
      padding: 25px;
    }

    &:not(:last-child) {
      &::before {
        position: absolute;
        top: 50%;
        right: 0;
        width: 200px;
        height: 1px;
        background-image: var(--stats-line);
        transform: rotate(-90deg) translateX(50%);
        transform-origin: right bottom;
        content: '';

        @include media($to: md) {
          display: none;
        }
      }
    }

    &_main {
      @include media($to: md) {
        width: 100%;
      }
    }

    &:not(.stats__item_main) {
      @include media($to: 660px) {
        width: 50%;
      }
    }
  }

  &__label {
    margin-bottom: 20px;
    color: var(--stats-label);
    font-weight: 600;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.37px;
    text-transform: uppercase;

    @include media($to: xs) {
      font-size: 10px;
      letter-spacing: 0;
    }
  }

  &__sum {
    margin-bottom: 5px;
    font-weight: 700;
    font-size: 23px;
    line-height: 1;
    letter-spacing: -0.3px;

    @include media($to: lg) {
      font-size: 16px;
    }
  }

  &__sticker {
    display: inline-block;
    margin: -3px 0 0;
    padding: 7px 5px 6px;
    color: #fcfcfd;
    font-weight: 600;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0;
    text-transform: uppercase;
    vertical-align: top;
    background: #58bd7d;
    border-radius: 4px;

    @include media($to: lg) {
      margin-top: -6px;
      margin-bottom: -3px;
    }
  }

  &__result {
    color: var(--stats-result);
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.09px;

    @include media($to: lg) {
      font-size: 14px;
    }

    > *:not(:last-child) {
      margin-right: 5px;
    }

    &__loss {
      color: #f00 !important;
    }

    strong {
      color: #58bd7d;
    }
  }
}
</style>
