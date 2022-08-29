<template>
  <div :class="$style.page">
    <div v-if="getters.isAuthorized.value" :class="$style.page__container">
      <FollowNovo />
      <div :class="$style.page__items">
        <div
          v-for="item in tokenInformation"
          :key="item.id"
          :class="$style.page__item"
        >
          <BaseCard
            :icon="item.icon"
            :label="item.label"
            :button-text="item.buttonText"
            :description="item.description"
            :detail-link="item.detailLink"
            v-bind="{ value: item.value }"
          />
        </div>
      </div>
    </div>
    <div v-else :class="$style.page__container">
      <ConnectWalletCard :class="$style.page__card" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import ConnectWalletCard from '~/components/ui/ConnectWalletCard.vue'
import FollowNovo from '~/components/ui/FollowNovo.vue'
import { useStore } from '~/store'
import BaseCard from '~/components/ui/BaseCard.vue'
import { BigNumber, ethers } from 'ethers'
import { convertBnbToUSD, convertToUSD } from '~/helpers/convertToCurrency'
import {
  ncosContractAddress,
  tokenContractAddress,
  tokenPairAddress,
  treasuryContractAddress,
} from '~/constants/addresses'

export default defineComponent({
  name: 'HomePage',
  components: { ConnectWalletCard, FollowNovo, BaseCard },
  data: () => ({
    tokenInformation: [
      {
        id: 1,
        icon: 'icon-coins',
        value: 'N/A',
        label: 'NOVO Price',
        buttonText: 'VIEW CHART',
        description:
          'The current market price of Novo on Decentralized Exchange',
        detailLink: 'https://dexscreener.com/bsc/' + tokenPairAddress,
      },
      {
        id: 2,
        icon: 'icon-graph',
        value: 'N/A',
        label: 'Market Cap',
        buttonText: 'VIEW BSCSCAN',
        description: 'total value of all NOVO tokens in  circulating supply',
        detailLink: 'https://bscscan.com/token/' + tokenContractAddress,
      },
      {
        id: 3,
        icon: 'icon-bank',
        value: 'N/A',
        label: 'Treasury Balance',
        buttonText: 'VIEW TREASURY',
        description: 'The dollar value of assets held in the protocol Treasury',
        detailLink: 'https://bscscan.com/address/' + treasuryContractAddress,
      },
      {
        id: 4,
        icon: 'icon-security-time',
        value: 'N/A',
        label: 'TVL',
        buttonText: 'MORE INFO',
        description: 'The dollar amount of all NOVO staked in the protocol',
        detailLink:
          'https://novo-2.gitbook.io/welcome-to-gitbook/faq#what-is-tvl-total-value-locked',
      },
      {
        id: 5,
        icon: 'icon-chart',
        value: 'N/A',
        label: 'Daily Reward Volume',
        buttonText: 'MORE INFO',
        description: 'The dollar value of rewards distributed today',
        detailLink: 'https://www.coingecko.com/en/coins/novo-token',
      },
      {
        id: 6,
        icon: 'icon-discount-full',
        value: 'N/A',
        label: 'Daily Volume',
        buttonText: 'MORE INFO',
        description: 'Total volume across Dex & Cex',
        detailLink: 'https://www.coingecko.com/en/coins/novo-token',
      },
      {
        id: 7,
        icon: 'icon-discount',
        value: '3%',
        label: 'Staking APY',
        buttonText: 'VIEW BSCSCAN',
        description: 'Current annual Percentage Yield on staking',
        detailLink: 'https://bscscan.com/token/' + tokenContractAddress,
      },
      {
        id: 8,
        icon: 'icon-convert-card',
        value: 'N/A',
        label: 'Total Stakers',
        buttonText: 'VIEW BSCSCAN',
        description: 'The amount of wallets staked',
        detailLink: 'https://bscscan.com/token/' + tokenContractAddress,
      },
    ],
  }),
  methods: {
    getInformationByWeb3() {
      const { state } = useStore()
      const provider = state.provider.getWeb3ProviderInstance()
      const signer = provider.getSigner()

      const novotoken_contract = new ethers.Contract(
        tokenContractAddress,
        ['function balanceOf(address account) public view returns (uint256)'],
        signer
      )

      const ncos_contract = new ethers.Contract(
        ncosContractAddress,
        ['function totalSupply() public view returns (uint256)'],
        signer
      )

      novotoken_contract
        .balanceOf(ncosContractAddress)
        .then(async (tvl: BigNumber) => {
          this.tokenInformation[3].value = convertToUSD(
            tvl.div(BigNumber.from(1e9)).toNumber() *
              parseFloat(this.tokenInformation[0].value.replace('$', ''))
          )
        })

      novotoken_contract
        .balanceOf(treasuryContractAddress)
        .then(async (novoBalance: number) => {
          let novoBalanceWithUSD =
            (novoBalance / 1e9) *
            parseFloat(this.tokenInformation[0].value.replace('$', ''))

          provider
            .getBalance(treasuryContractAddress)
            .then((balanceWallet: BigNumber) => {
              convertBnbToUSD((balanceWallet as any) / 1e18).then((res) => {
                novoBalanceWithUSD += res
                this.tokenInformation[2].value =
                  convertToUSD(novoBalanceWithUSD)
              })
            })
            .catch((error) => console.log(error))
        })

      ncos_contract.totalSupply().then((totalSupply: any) => {
        this.tokenInformation[7].value = totalSupply
      })
    },
  },
  created() {
    fetch(
      'https://api.dexscreener.com/latest/dex/pairs/bsc/' + tokenPairAddress
    )
      .then(async (response) => {
        const data = await response.json()

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText
          return Promise.reject(error)
        }

        this.tokenInformation[0].value = '$' + data.pair.priceUsd
        this.tokenInformation[1].value = convertToUSD(
          984112880.53 * (data.pair.priceUsd as number)
        )
        this.tokenInformation[4].value = convertToUSD(
          parseInt(data.pair.volume.h24) * 0.03
        )
        this.tokenInformation[5].value = convertToUSD(
          data.pair.volume.h24 as number
        )

        this.getInformationByWeb3()
      })
      .catch((error) => {
        console.error('There was an error!', error)
      })
  },
  watch: {
    isAuthorized: function () {
      this.getInformationByWeb3()
    },
  },
  setup() {
    const { getters } = useStore()

    const isAuthorized = computed(() => {
      return getters.isAuthorized.value
    })

    return { getters, isAuthorized }
  },
})
</script>

<style lang="scss" module>
.page {
  max-width: 1194px;
  margin: 0 auto;

  &__container {
    margin: 0 auto;
    padding: 38px;

    @include media($to: sm) {
      padding: 40px 24px;
    }

    @include media($to: xs) {
      padding: 40px 16px;
    }
  }

  &__card {
    max-width: 642px;
    margin: 22px auto;
  }

  &__items {
    margin: -16px;
    padding-top: 32px;

    @include media($from: xs) {
      display: flex;
      flex-wrap: wrap;
    }
  }

  &__item {
    display: flex;
    padding: 16px;

    @include media($from: xs, $to: sm) {
      width: 50%;
    }

    @include media($from: sm, $to: lg) {
      width: 33.33%;
    }

    @include media($from: lg) {
      width: 25%;
    }

    > * {
      flex: 1 1 auto;
      width: 100%;
    }
  }
}
</style>
