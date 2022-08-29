<template>
  <div :class="$style.page">
    <div :class="$style.page__container">
      <TheLoadingScreen v-if="isLoading"></TheLoadingScreen>
      <div v-if="!(isLoading || isNewMintDisabled)" :class="$style.page__main">
        <InfoBox v-slot="{ classList }">
          <CertificateMintSection
            icon="icon-certificate"
            :mint-callback="doStake"
            :is-new-mint-disable="isNewMintDisabled"
            :class="classList"
          >
            <template #text>
              Activating Proxy Growth means that the Smart Treasury <br />
              will use your stake to earn additional rewards.
              <a href="">Learn more</a>
            </template>
          </CertificateMintSection>
        </InfoBox>
      </div>
      <div v-if="!isLoading" :class="$style.page__main">
        <InfoBox v-slot="{ classList }">
          <CertificateStatusSection
            icon="icon-certificate"
            :claim-reward-callback="claimReward"
            :class="classList"
            :staker-name-value="stakerName"
            :principal-amount-value="principalAmount"
            :reward-amount-value="rewardAmount"
            :additional-owner-value="
              additionalOwner.length > 12
                ? [additionalOwner.slice(0, 6), additionalOwner.slice(-5)].join(
                    '...'
                  )
                : additionalOwner
            "
            :staking-date-value="stakingDate"
            :un-staking-date-value="unstakingDate"
            :proxy-status-value="proxyStatus"
            :remain-seconds-for-unstake="remainSecondsForUnstake"
            :token-u-r-i="tokenURI"
          >
          </CertificateStatusSection>
        </InfoBox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoBox from '~/components/ui/InfoBox.vue'
import { useStore } from '~/store'
import { ethers } from 'ethers'
import { emitter } from '~/services/emitter'
import { convertToNovo } from '~/helpers/convertToCurrency'
import CertificateMintSection from '~/components/ui/CertificateMintSection.vue'
import CertificateStatusSection from '~/components/ui/CertificateStatusSection.vue'
import TheLoadingScreen from '~/components/common/TheLoadingScreen.vue'

export default defineComponent({
  name: 'StakingStakePage',
  components: {
    InfoBox,
    CertificateMintSection,
    CertificateStatusSection,
    TheLoadingScreen,
  },
  data: () => ({
    stakerName: '---',
    principalAmount: '---',
    rewardAmount: '---',
    additionalOwner: '---',
    stakingDate: '---',
    unstakingDate: '---',
    proxyStatus: '---',
    remainSecondsForUnstake: 1,
    isNewMintDisabled: true,
    tokenURI: '',
    isLoading: false,
  }),
  methods: {
    async doStake(stakingDetails: any) {
      const stakingWithSigner = this.methods
        .getNcosContract()
        .connect(this.methods.getSigner())
      const amount = ethers.utils.parseUnits(
        parseFloat(stakingDetails.stakingAmount.replaceAll(',', '')).toString(),
        9
      )
      try {
        let tx = await stakingWithSigner.mint(
          1,
          amount,
          stakingDetails.stakerName,
          stakingDetails.additionalOwner == ''
            ? '0x0000000000000000000000000000000000000000'
            : stakingDetails.additionalOwner,
          stakingDetails.isProxyActive ? 1 : 0
        )

        this.methods.setAlertProperty(
          'Stake pending. This can take a few seconds to finish.',
          'pending'
        )
        emitter.emit('alert:open')

        await tx.wait()
        this.isNewMintDisabled = true
        this.stakerName = stakingDetails.stakerName
        this.principalAmount = stakingDetails.stakingAmount + ' NOVO'
        this.rewardAmount = '0.00 NOVO'
        this.additionalOwner =
          stakingDetails.additionalOwner == ''
            ? '---'
            : stakingDetails.additionalOwner
        this.stakingDate = new Date().toUTCString()
        this.remainSecondsForUnstake = 3600 * 24 * 4
        this.unstakingDate = new Date(
          new Date().getTime() + 3600 * 1000 * 24 * 7
        ).toUTCString()
        this.proxyStatus = stakingDetails.isProxyActive ? 'True' : 'False'
        stakingWithSigner
          .walletOfOwner(this.getters.selectedAccount.value)
          .then((tokenIds: any) => {
            stakingWithSigner.tokenURI(tokenIds[0]).then((uri: string) => {
              this.tokenURI = uri.substr(0, uri.lastIndexOf('.')) + '.png'
            })
          })
        this.methods.setAlertProperty('Stake Successful!', 'success')
        emitter.emit('alert:open')
      } catch (error) {
        this.methods.setAlertProperty('Stake Failed', 'danger')
        emitter.emit('alert:open')
      }
    },
    async claimReward() {
      const stakingWithSigner = this.methods
        .getNcosContract()
        .connect(this.methods.getSigner())
      try {
        let tokenIds = await stakingWithSigner.walletOfOwner(
          this.getters.selectedAccount.value
        )
        let tx = await stakingWithSigner.unstaking(tokenIds[0])
        this.methods.setAlertProperty(
          'UnStake pending. This can take a few seconds to finish.',
          'pending'
        )
        emitter.emit('alert:open')
        await tx.wait()
        this.isNewMintDisabled = false
        this.stakerName = '---'
        this.principalAmount = '---'
        this.rewardAmount = '---'
        this.additionalOwner = '---'
        this.stakingDate = '---'
        this.remainSecondsForUnstake = 1
        this.unstakingDate = '---'
        this.proxyStatus = '---'
        this.tokenURI = ''
        this.methods.setAlertProperty('UnStake Successful!', 'success')
        emitter.emit('alert:open')
      } catch (error) {
        this.methods.setAlertProperty('UnStake Failed', 'danger')
        emitter.emit('alert:open')
      }
    },
  },
  async created() {
    const { getters, methods } = useStore()
    this.isLoading = true
    const stakingWithSigner = methods
      .getNcosContract()
      .connect(methods.getSigner())
    let nocsBal = await stakingWithSigner.balanceOf(
      getters.selectedAccount.value
    )
    console.log(nocsBal)

    if (nocsBal == 0) {
      this.isLoading = false
      this.isNewMintDisabled = false
      return
    }

    try {
      let stakeDetails = await stakingWithSigner.getStakingStatusByAddress(
        getters.selectedAccount.value
      )

      console.log(stakeDetails)
      let status = stakeDetails.stakeInfo
      this.stakerName = status.stakerName
      this.principalAmount =
        (parseFloat(status.principalBalance) / 1000000000)
          .toFixed(2)
          .toString() + ' NOVO'
      this.rewardAmount =
        (
          parseFloat(status.bagSizeReward) / 1000000000 +
          parseFloat(status.stakingTimeReward) / 1000000000
        )
          .toFixed(2)
          .toString() + ' NOVO'
      this.additionalOwner =
        status.addtionalWallet == '0x0000000000000000000000000000000000000000'
          ? '---'
          : status.addtionalWallet
      this.stakingDate = new Date(
        parseInt(status.stakingTimestamp) * 1000
      ).toUTCString()
      this.unstakingDate = new Date(
        parseInt(status.stakingTimestamp) * 1000 + 3600 * 1000 * 24 * 7
      ).toUTCString()
      this.proxyStatus = parseInt(status.proxyStatus) == 1 ? 'True' : 'False'
      this.isNewMintDisabled = true
      this.remainSecondsForUnstake =
        parseInt(status.stakingTimestamp) +
        3600 * 24 * 4 -
        new Date().getTime() / 1000
      this.tokenURI =
        stakeDetails.tokenUri.substr(
          0,
          stakeDetails.tokenUri.lastIndexOf('.')
        ) + '.png'
      this.isLoading = false
    } catch (error) {
      this.isNewMintDisabled = false
      this.isLoading = false
      this.methods.setAlertProperty(
        'Can not load the staking information',
        'danger'
      )
      emitter.emit('alert:open')
    }
  },
  setup() {
    const { getters, methods } = useStore()
    return {
      getters,
      methods,
      convertToNovo,
    }
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
