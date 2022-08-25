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
import { defineComponent, watch, ref, computed } from 'vue'
import ConnectWalletCard from '~/components/ui/ConnectWalletCard.vue'
import FollowNovo from '~/components/ui/FollowNovo.vue'
import { useStore } from '~/store'
import BaseCard from '~/components/ui/BaseCard.vue'
import { ethers } from 'ethers'
import {
  convertBnbToUSD,
  convertToNovo,
  convertToUSD,
} from '~/helpers/convertToCurrency'
import {
  stakingContractAddress,
  tokenContractAddress,
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
        detailLink:
          'https://dexscreener.com/bsc/0xfc588a644edead922fe88055e03da5d9dd637eb0',
      },
      {
        id: 2,
        icon: 'icon-graph',
        value: 'N/A',
        label: 'Market Cap',
        buttonText: 'VIEW BSCSCAN',
        description: 'total value of all NOVO tokens in  circulating supply',
        detailLink:
          'https://bscscan.com/token/0xCb10A6B203120C50Cce48e3E1131aA717A82fb5F',
      },
      {
        id: 3,
        icon: 'icon-bank',
        value: 'N/A',
        label: 'Treasury Balance',
        buttonText: 'VIEW TREASURY',
        description: 'The dollar value of assets held in the protocol Treasury',
        detailLink:
          'https://bscscan.com/address/0x927A100BCB00553138C6CFA22A4d3A8dbe1156D7',
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
        value: 'N/A',
        label: 'Staking APY',
        buttonText: 'VIEW BSCSCAN',
        description: 'Current annual Percentage Yield on staking',
        detailLink:
          'https://bscscan.com/token/0xCb10A6B203120C50Cce48e3E1131aA717A82fb5F',
      },
      {
        id: 8,
        icon: 'icon-convert-card',
        value: 'N/A',
        label: 'Total Stakers',
        buttonText: 'VIEW BSCSCAN',
        description: 'The amount of wallets staked',
        detailLink:
          'https://bscscan.com/token/0xCb10A6B203120C50Cce48e3E1131aA717A82fb5F',
      },
    ],
  }),
  methods: {
    getInformationByWeb3() {
      const { state } = useStore()
      const provider = state.provider.getWeb3ProviderInstance()
      const signer = provider.getSigner()
      const staking_contract = new ethers.Contract(
        stakingContractAddress,
        ['function vaultAvailableBalance() public view returns (uint256)'],
        signer
      )

      staking_contract.vaultAvailableBalance().then(async (tvl: any) => {
        console.log(tvl)
        this.tokenInformation[3].value = convertToUSD(
          (tvl / 1e9) *
            parseFloat(this.tokenInformation[0].value.replace('$', ''))
        )
        console.log(this.tokenInformation[3].value)
      })

      const novotoken_contract = new ethers.Contract(
        tokenContractAddress,
        ['function balanceOf(address account) public view returns (uint256)'],
        signer
      )

      novotoken_contract
        .balanceOf(treasuryContractAddress)
        .then(async (novoBalance: any) => {
          console.log(novoBalance / 1e9)
          let novoBalanceWithUSD =
            (novoBalance / 1e9) *
            parseFloat(this.tokenInformation[0].value.replace('$', ''))

          provider
            .getBalance(treasuryContractAddress)
            .then((balanceWallet: any) => {
              convertBnbToUSD((balanceWallet as any) / 1e18).then((res) => {
                console.log(res)
                novoBalanceWithUSD += res
                this.tokenInformation[2].value =
                  convertToUSD(novoBalanceWithUSD)
              })
            })
            .catch((error) => console.log(error))
        })
    },
  },
  created() {
    fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=novo-token&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    )
      .then(async (response) => {
        const data = await response.json()

        // console.log(data)

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText
          return Promise.reject(error)
        }

        Promise.all(
          data.map((item: { [x: string]: string }) => {
            this.tokenInformation[0].value = '$' + item['current_price']
            this.tokenInformation[1].value = convertToUSD(
              984112880.53 * (item['current_price'] as any)
            )
            this.tokenInformation[4].value = convertToUSD(
              parseInt(item['total_volume']) * 0.03
            )
            this.tokenInformation[5].value = convertToUSD(
              item['total_volume'] as any
            )
          })
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
