<template>
  <div :class="$style.page">
    <div :class="$style.page__container">
      <div :class="$style.page__info">
        <InfoBox v-slot="{ classList }">
          <InfoBoxSection icon="icon-graph" :class="classList">
            <template #value> {{ shareOfPool.percentage }} </template>
            <template #title> Share of staking pool </template>
            <template #text>
              Staking
              <strong>{{ convertToNovo(shareOfPool.amount) }}</strong> tokens
              into the staking pool will earn
              <strong>{{ shareOfPool.percentage }}</strong> of the rewards
            </template>
          </InfoBoxSection>
          <InfoBoxSection icon="icon-chart" :class="classList">
            <template #value> $0.00 </template>
            <template #title> Rewards earned yesterday </template>
            <template #text>
              Your
              <strong>{{ convertToNovo(shareOfPool.amount) }}</strong> tokens
              into the staking pool has earned
              <strong>0 NOVO</strong>
            </template>
          </InfoBoxSection>
        </InfoBox>
      </div>
      <div :class="$style.page__main">
        <EnterBalance
          v-model="balance"
          :status="getters.selectedAllowance.value > 0"
          :status-text="statusText"
          icon="icon-security"
          title="Stake Novo"
          label="Novo"
          button-text="Stake Novo"
          :callback="doStake"
        />
      </div>
      <div :class="$style.page__info">
        <InfoBox v-slot="{ classList }">
          <InfoBoxSection icon="icon-timer" :class="classList">
            <template #value> 0 Day 0 Hr 0 Min </template>
            <template #title> Time Staked </template>
            <template #text>
              By staking longer, you will gain a greater share of rewards as
              others unstake
            </template>
          </InfoBoxSection>
          <InfoBoxSection icon="icon-cup" :class="classList">
            <template #value> {{ longestTimeStaked }} </template>
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
import { defineComponent, onMounted, computed } from 'vue'
import InfoBox from '~/components/ui/InfoBox.vue'
import InfoBoxSection from '~/components/ui/InfoBoxSection.vue'
import EnterBalance from '~/components/ui/EnterBalance.vue'
import { useStore } from '~/store'
import { ethers } from 'ethers'
import { emitter } from '~/services/emitter'
import { convertToNovo } from '~/helpers/convertToCurrency'

export default defineComponent({
  name: 'StakingStakePage',
  components: { InfoBox, InfoBoxSection, EnterBalance },
  data: () => ({
    balance: '0',
  }),
  methods: {
    async doStake() {
      const stakingWithSigner = this.methods
        .getStakingContract()
        .connect(this.methods.getSigner())
      const amount = ethers.utils.parseUnits(this.balance, 9)
      try {
        let tx = await stakingWithSigner.stake(amount)

        this.methods.setAlertProperty(
          'Stake pending. This can take a few seconds to finish.',
          'pending'
        )
        emitter.emit('alert:open')

        await tx.wait()
        this.methods.setBalance(this.getters.selectedAccount.value)
        this.methods.setStakeCount(this.getters.selectedAccount.value)
        this.methods.setStakeReward(this.getters.selectedAccount.value, 0)

        this.methods.setAlertProperty('Stake Successful!', 'success')
        emitter.emit('alert:open')
      } catch (error) {
        this.methods.setErrorMessage((error as Error).message)
        emitter.emit('confirmSwap:open')

        this.methods.setAlertProperty('Stake Failed', 'danger')
        emitter.emit('alert:open')
      }
    },
  },
  computed: {
    shareOfPool() {
      const amount = Number(this.balance.replaceAll(',', ''))
      const percentage = `${(
        (amount / (this.getters.vaultAvailableBalance.value + amount)) *
        100
      ).toFixed(2)}%`
      return {
        amount,
        percentage,
      }
    },
  },
  setup() {
    const { getters, methods } = useStore()

    const statusText = computed(() => {
      if (getters.selectedAllowance.value > 0) {
        return 'STAKING APPROVED'
      } else {
        return 'STAKING UNAPPROVED'
      }
    })

    const longestTimeStaked = computed(() => {
      const LTS = getters.selectedCurrentStake.value.longestTimeStaked
      const oneMinute = 60
      const oneHour = oneMinute * 60
      const oneDay = oneHour * 24

      return `${Math.floor(LTS / oneDay)} Day ${Math.floor(
        (LTS % oneDay) / oneHour
      )} Hr ${Math.floor((LTS % oneHour) / oneMinute)} Min`
    })

    onMounted(async () => {
      methods.setAllowance(getters.selectedAccount.value)
    })

    return {
      getters,
      methods,
      statusText,
      longestTimeStaked,
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
