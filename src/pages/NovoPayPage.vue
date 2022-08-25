<template>
  <div :class="$style.page">
    <div :class="$style.page__container">
      <div :class="$style.page__info">
        <InfoBox v-slot="{ classList }">
          <InfoBoxSection icon="icon-binance-coin" :class="classList">
            <template #value> $500 </template>
            <template #title> Worth of BNB </template>
            <template #text>
              Your <strong>$500</strong> will be used to purchase BNB which will
              be swapped for NOVO
            </template>
          </InfoBoxSection>
          <InfoBoxSection icon="icon-binance-coins" :class="classList">
            <template #value> 1.2 BNB </template>
            <template #title> BNB Recieved </template>
            <template #text>
              You will recieve <strong>1.2 BNB</strong> that will be used in
              real time to swap for Novo
            </template>
          </InfoBoxSection>
        </InfoBox>
      </div>
      <div :class="$style.page__main">
        <EnterBalance
          v-model="balance"
          icon="icon-wallet-add"
          title="Buy Novo"
          label="$"
          button-text="Buy Novo"
          :showMax="false"
          :callback="openRamp"
        />
      </div>
      <div :class="$style.page__info">
        <InfoBox v-slot="{ classList }">
          <InfoBoxSection icon="icon-logo1x1" :class="classList">
            <template #value> 1,909,212.2 NOVO </template>
            <template #title> NOVO Recieved </template>
            <template #text>
              By swapping <strong>1.2 BNB</strong> you will receive approx
              <strong>1,909,212.2 NOVO</strong>
            </template>
          </InfoBoxSection>
          <InfoBoxSection icon="icon-logos1x1" :class="classList">
            <template #value> .000282 </template>
            <template #title> Price per NOVO </template>
            <template #text>
              You are purchasing <strong>1,909,212.2 NOVO</strong> for an
              average price of <strong>0.000282</strong>
            </template>
          </InfoBoxSection>
        </InfoBox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoBox from '~/components/ui/InfoBox.vue'
import InfoBoxSection from '~/components/ui/InfoBoxSection.vue'
import EnterBalance from '~/components/ui/EnterBalance.vue'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { ethers } from 'ethers'
import { useStore } from '~/store'

export default defineComponent({
  name: 'NovoPayPage',
  components: { InfoBox, InfoBoxSection, EnterBalance },
  data: () => ({
    balance: '0',
  }),
  methods: {
    async getContractWithSigner() {
      const { state } = useStore()
      const provider = state.provider.getWeb3ProviderInstance()
      const infuraProvider = new ethers.providers.Web3Provider(provider as any)
      const signer = infuraProvider.getSigner()
      const contract = new ethers.Contract(
        '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        [
          'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
        ],
        signer
      )

      return contract
    },

    openRamp() {
      let widget = new RampInstantSDK({
        hostAppName: 'Novo-Pay',
        hostLogoUrl: 'https://rampnetwork.github.io/assets/misc/test-logo.png',
        swapAsset: 'BSC_BNB',
        userAddress: this.getters.selectedAccount.value,
        fiatCurrency: 'USD',
        fiatValue: this.balance,
        // url: 'https://ri-widget-staging.firebaseapp.com/', // testing url
      })

      widget.on('*', (event) => {
        if (event.type == 'PURCHASE_SUCCESSFUL') {
          // swap the BNB to NOVO
          this.getContractWithSigner().then((signer) => {
            signer.swapExactETHForTokens(
              0,
              [
                '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // 0x094616f0bdfb0b526bd735bf66eca0ad254ca81f
                '0xCb10A6B203120C50Cce48e3E1131aA717A82fb5F', // 0x7C2e03b5BF995bABBd794b1326e663b6f57114ad
              ],
              this.getters.selectedAccount.value,
              Math.floor(Date.now() / 1000) + 900,
              {
                value: event.payload?.purchase.cryptoAmount,
              }
            )
          })
        }
      })

      widget.show()
    },
  },
  setup() {
    const { getters } = useStore()
    return { getters }
  },
})
</script>

<style lang="scss" module>
.page {
  max-width: 1194px;
  margin: 0 auto;

  &__container {
    display: flex;
    max-width: 1164px;
    margin: 0 auto;
    padding: 28px 47px;

    @include media($to: sm) {
      padding: 27px 11px;
    }

    @include media($to: lg) {
      flex-wrap: wrap;
    }
  }

  &__info {
    padding: 13px;

    @include media($from: sm) {
      flex: 0 0 auto;
      width: 280px;
    }

    @include media($to: lg) {
      width: 50%;
    }

    @include media($to: xs) {
      width: 100%;
    }
  }

  &__main {
    flex: 1 1 auto;
    padding: 13px;

    @include media($to: lg) {
      order: -1;
    }
  }
}
</style>
