<template>
  <div :class="$style.page">
    <div :class="$style.page__container">
      <div :class="$style.page__info">
        <InfoBox v-slot="{ classList }">
          <InfoBoxSection icon="icon-graph" :class="classList">
            <template #value> {{ stakeStats.shareOfPool }} </template>
            <template #title> Share of staking pool </template>
            <template #text>
              Staking
              <strong>{{ convertToNovo(stakeInfo.staked[0]) }}</strong> tokens
              into the staking pool will earn
              <strong>{{ stakeStats.shareOfPool }}</strong> of the rewards
            </template>
          </InfoBoxSection>
          <InfoBoxSection icon="icon-chart" :class="classList">
            <template #value>
              {{ convertToUSD(stakeInfo.rewards[1]) }}
            </template>
            <template #title> Total Rewards </template>
            <template #text>
              Your
              <strong>{{ convertToNovo(stakeInfo.staked[0]) }}</strong> tokens
              into the staking pool has earned
              <strong>{{
                `${convertToNovo(stakeInfo.rewards[0])} NOVO`
              }}</strong>
            </template>
          </InfoBoxSection>
        </InfoBox>
      </div>
      <div :class="$style.page__main">
        <UnstakeDetails
          v-model="balance"
          v-model:index="currentIndex"
          :status="unstakeStatus"
          status-text="Unstake Status"
          label="Novo"
          button-text="Unstake"
          :address="stakingContractAddress"
          :values="stakeInfo"
          :callback="doUnstake"
          :seconds="leftSeconds"
          :length="stakeCount"
        />
      </div>
      <div :class="$style.page__info">
        <InfoBox v-slot="{ classList }">
          <InfoBoxSection icon="icon-timer" :class="classList">
            <template #value> {{ stakeStats.timeStaked }} </template>
            <template #title> Time Staked </template>
            <template #text>
              By staking longer, you will gain a greater share of rewards as
              others unstake
            </template>
          </InfoBoxSection>
          <InfoBoxSection icon="icon-cup" :class="classList">
            <template #value> {{ stakeStats.longestTimeStaked }} </template>
            <template #title> Longest Staker </template>
            <template #text>
              The longest staker is known as the Timekeeper. The goal is to
              become the Timekeeper.
            </template>
          </InfoBoxSection>
        </InfoBox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from 'vue'
import InfoBox from '~/components/ui/InfoBox.vue'
import InfoBoxSection from '~/components/ui/InfoBoxSection.vue'
import UnstakeDetails from '~/components/ui/UnstakeDetails.vue'
import { useStore } from '~/store'
import { stakingContractAddress } from '~/constants/addresses'
import { ethers } from 'ethers'
import { emitter } from '~/services/emitter'
import { convertToNovo, convertToUSD } from '~/helpers/convertToCurrency'

export default defineComponent({
  name: 'StakingCurrentStakePage',
  components: { InfoBox, InfoBoxSection, UnstakeDetails },
  data: () => ({
    balance: '0',
  }),
  methods: {
    async doUnstake() {
      const stakingWithSigner = this.methods
        .getStakingContract()
        .connect(this.methods.getSigner())
      const amount = ethers.utils.parseUnits(this.balance, 9)
      try {
        let tx = await stakingWithSigner.unstake(this.currentIndex, amount)

        this.methods.setAlertProperty('Unstake Pending', 'pending')
        emitter.emit('alert:open')

        await tx.wait()
        this.methods.setBalance(this.getters.selectedAccount.value)
        this.methods.setStakeCount(this.getters.selectedAccount.value)
        this.methods.setStakeReward(this.getters.selectedAccount.value, 0)
        this.currentIndex = 0

        this.methods.setAlertProperty('Unstake Successful!', 'success')
        emitter.emit('alert:open')
      } catch (error) {
        this.methods.setErrorMessage((error as Error).message)
        emitter.emit('confirmSwap:open')

        this.methods.setAlertProperty('Unstake Failed', 'danger')
        emitter.emit('alert:open')
      }
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

    const stakeCount = computed(() => {
      return getters.selectedStakeCount.value
    })

    const unstakeStatus = computed(() => {
      if (getters.selectedStakeCount.value > 0) {
        if (getters.selectedCurrentStake.value.lockedDays > 6) {
          return true
        }
      }
      return false
    })

    const currentPrice = ref(0)

    const stakeInfo = computed(() => {
      return {
        unstaked: [
          getters.selectedBalance.value,
          getters.selectedBalance.value * currentPrice.value,
        ],
        staked: [
          getters.selectedCurrentStake.value.amount,
          getters.selectedCurrentStake.value.amount * currentPrice.value,
        ],
        rewards: [
          getters.selectedStakeReward.value,
          getters.selectedStakeReward.value * currentPrice.value,
        ],
        stakedBalance: [
          getters.selectedCurrentStake.value.amount +
            getters.selectedStakeReward.value,
          (getters.selectedCurrentStake.value.amount +
            getters.selectedStakeReward.value) *
            currentPrice.value,
        ],
        totalBalance: [
          getters.selectedBalance.value +
            getters.selectedCurrentStake.value.amount +
            getters.selectedStakeReward.value,
          (getters.selectedBalance.value +
            getters.selectedCurrentStake.value.amount +
            getters.selectedStakeReward.value) *
            currentPrice.value,
        ],
      }
    })

    const leftSeconds = computed(() => {
      return getters.selectedCurrentStake.value.leftSeconds
    })

    const currentIndex = ref(0)

    const stakeStats = computed(() => {
      const timeStaked = getters.selectedCurrentStake.value.timeStaked
      const longestTimeStaked =
        getters.selectedCurrentStake.value.longestTimeStaked
      const oneMinute = 60
      const oneHour = oneMinute * 60
      const oneDay = oneHour * 24

      return {
        shareOfPool: `${(
          (getters.selectedCurrentStake.value.amount /
            getters.vaultAvailableBalance.value) *
          100
        ).toFixed(2)}%`,
        timeStaked: `${Math.floor(timeStaked / oneDay)} Day ${Math.floor(
          (timeStaked % oneDay) / oneHour
        )} Hr ${Math.floor((timeStaked % oneHour) / oneMinute)} Min`,
        longestTimeStaked: `${Math.floor(
          longestTimeStaked / oneDay
        )} Day ${Math.floor(
          (longestTimeStaked % oneDay) / oneHour
        )} Hr ${Math.floor((longestTimeStaked % oneHour) / oneMinute)} Min`,
      }
    })

    watch(currentIndex, (value) => {
      methods.setCurrentStake(getters.selectedAccount.value, value)
      methods.setStakeReward(getters.selectedAccount.value, value)
    })

    onMounted(async () => {
      methods.setStakeCount(getters.selectedAccount.value)
      methods.setStakeReward(getters.selectedAccount.value, 0)
    })

    return {
      getters,
      methods,
      unstakeStatus,
      stakingContractAddress,
      stakeInfo,
      currentPrice,
      stakeCount,
      currentIndex,
      leftSeconds,
      stakeStats,
      convertToNovo,
      convertToUSD,
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
