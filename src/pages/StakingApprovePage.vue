<template>
  <div :class="$style.page">
    <div :class="$style.page__container">
      <DetailsDescription :class="$style.page__content">
        <template #label> START STAKING </template>
        <template #title> Why do I need to approve Staking? </template>
        <template #description>
          If this is your first time staking NOVO, you will need to approve Novo
          Protocol to use your balance for staking. Simply select the “Approve”
          button and you will be directed to approve the transaction. Once
          complete, you can continue to staking your Novo and you will not be
          asked to complete this again.
        </template>
        <template #footer="{ classList }">
          <BaseButton
            ui="primary"
            size="sm"
            :class="classList.button"
            @click="doApprove"
            :disabled="isApproved"
          >
            Approve Staking
          </BaseButton>
          <div :class="classList.divider">or</div>
          <RouterLink :to="{ name: 'HowToUse' }" :class="classList.link">
            Buy Novo
          </RouterLink>
        </template>
      </DetailsDescription>
      <TheStakingFigure :class="$style.page__image" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import TheStakingFigure from '~/components/common/TheStakingFigure.vue'
import DetailsDescription from '~/components/ui/DetailsDescription.vue'
import { useStore } from '~/store'
import { stakingContractAddress } from '~/constants/addresses'
import { ethers } from 'ethers'
import { emitter } from '~/services/emitter'

export default defineComponent({
  name: 'StakingApprovePage',
  components: {
    BaseButton,
    TheStakingFigure,
    DetailsDescription,
  },
  data: () => ({
    isApproved: false,
  }),
  created() {
    const { getters, methods } = useStore()
    const novoWithSigner = methods
      .getTokenContract()
      .connect(methods.getSigner())
    try {
      novoWithSigner
        .allowance(getters.selectedAccount.value, stakingContractAddress)
        .then((res: number) => {
          this.isApproved = res > 0
        })
    } catch (error) {
      methods.setErrorMessage((error as Error).message)
      emitter.emit('confirmSwap:open')
    }
  },
  setup() {
    const { getters, methods } = useStore()

    const doApprove = async () => {
      const totalSupply = '1000000000'
      const novoWithSigner = methods
        .getTokenContract()
        .connect(methods.getSigner())
      const amount = ethers.utils.parseUnits(totalSupply, 9)
      try {
        let tx = await novoWithSigner.approve(stakingContractAddress, amount)

        methods.setAlertProperty('Staking Approval Pending', 'pending')
        emitter.emit('alert:open')

        await tx.wait()

        methods.setAlertProperty('Staking Approval Successful!', 'success')
        emitter.emit('alert:open')
        methods.setAllowance(getters.selectedAccount.value)
      } catch (error) {
        methods.setErrorMessage((error as Error).message)
        emitter.emit('confirmSwap:open')

        methods.setAlertProperty('Staking Approval Failed', 'danger')
        emitter.emit('alert:open')
      }

      onMounted(async () => {
        methods.setAllowance(getters.selectedAccount.value)
      })
    }

    return {
      getters,
      doApprove,
    }
  },
})
</script>

<style lang="scss" module>
.page {
  max-width: 1194px;
  margin: 0 auto;

  &__container {
    max-width: 1092px;
    padding: 20px 40px;

    @include media($from: sm) {
      display: flex;
      align-items: flex-end;
    }

    @include media($to: sm) {
      padding: 40px 24px;
    }
  }

  &__content {
    @include media($from: sm) {
      flex: 1 1 auto;
      max-width: 556px;
      padding-right: 40px;
    }
  }

  &__image {
    display: block;
    max-width: 392px;

    @include media($from: sm) {
      flex: 0 0 auto;
      margin-left: auto;
    }

    @include media($to: sm) {
      width: 100%;
      margin: 40px auto 0;
    }
  }
}
</style>
