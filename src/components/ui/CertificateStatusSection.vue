<template>
  <div :class="$style.section">
    <div :class="$style.section__certimage">
      <BaseIcon
        v-if="tokenURI == ''"
        :name="icon"
        :class="$style.section__icon"
      />
      <img
        :src="tokenURI"
        :class="tokenURI == '' ? $style.section__hide : $style.section__image"
      />
      <h2>Certificate of Stake</h2>
    </div>
    <div :class="$style.section__certstatus">
      <div :class="$style.section__statuslabel">
        <span :class="$style.section__inputlabel">Stake Name:</span>
        <span :class="$style.section__inputlabel">{{ stakerName }}</span>
      </div>
      <div :class="$style.section__statuslabel">
        <span :class="$style.section__inputlabel">Principal:</span>
        <span :class="$style.section__inputlabel">{{ principalAmount }}</span>
      </div>
      <div :class="$style.section__statuslabel">
        <span :class="$style.section__inputlabel">Reward:</span>
        <span :class="$style.section__inputlabel">{{ rewardAmount }}</span>
      </div>
      <div :class="$style.section__statuslabel">
        <span :class="$style.section__inputlabel">Additional Owner:</span>
        <span :class="$style.section__inputlabel">{{ additionalOwner }}</span>
      </div>
      <div :class="$style.section__statuslabel">
        <span :class="$style.section__inputlabel">Date:</span>
        <span :class="$style.section__inputlabel">{{ stakingDate }}</span>
      </div>
      <div :class="$style.section__statuslabel">
        <span :class="$style.section__inputlabel">Free Unstake Date:</span>
        <span :class="$style.section__inputlabel">{{ unStakingDate }}</span>
      </div>
      <div :class="$style.section__statuslabel">
        <span :class="$style.section__inputlabel">Proxy Status:</span>
        <span :class="$style.section__inputlabel">{{ proxyStatus }}</span>
      </div>
      <BaseButton
        ui="primary"
        size="lg"
        v-if="!(tokenURI == '')"
        :disabled="isUnstakeDisable"
        :class="$style.section__unstakingbutton"
        @click="claimReward()"
        >{{
          isUnstakeDisable ? 'Unstake in ' + timer : 'Claim Reward'
        }}</BaseButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useStore } from '~/store'
import BaseIcon from './BaseIcon.vue'
import BaseButton from './BaseButton.vue'

export default defineComponent({
  name: 'CertificateStatusSection',
  components: { BaseIcon, BaseButton },
  props: {
    icon: {
      type: String,
      required: true,
    },
    tokenURI: {
      type: String,
      default: '',
    },
    claimRewardCallback: {
      type: Function,
      required: true,
    },
    stakerNameValue: {
      type: String,
      default: '',
    },
    principalAmountValue: {
      type: String,
      default: '',
    },
    rewardAmountValue: {
      type: String,
      default: '',
    },
    additionalOwnerValue: {
      type: String,
      default: '',
    },
    stakingDateValue: {
      type: String,
      default: '',
    },
    unStakingDateValue: {
      type: String,
      default: '',
    },
    proxyStatusValue: {
      type: String,
      default: '',
    },
    remainSecondsForUnstake: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { getters } = useStore()

    const stakerName = computed(() => {
      return props.stakerNameValue
    })

    const principalAmount = computed(() => {
      return props.principalAmountValue
    })

    const rewardAmount = computed(() => {
      return props.rewardAmountValue
    })

    const additionalOwner = computed(() => {
      return props.additionalOwnerValue
    })

    const stakingDate = computed(() => {
      return props.stakingDateValue
    })

    const unStakingDate = computed(() => {
      return props.unStakingDateValue
    })

    const proxyStatus = computed(() => {
      return props.proxyStatusValue
    })

    const isUnstakeDisable = computed(() => {
      return props.remainSecondsForUnstake > 0
    })

    const counter = ref(props.remainSecondsForUnstake)

    const timer = computed(() => {
      const days = counter.value / 60 / 60 / 24
      const hours = (days % 1) * 24
      const minutes = (hours % 1) * 60
      const seconds = (minutes % 1) * 60

      const fixedDays = Math.floor(days)
      const fixedHours = Math.floor(hours)
      const fixedMinutes = Math.floor(minutes)
      const fixedSeconds = Math.round(seconds)

      const dayWord = fixedDays > 1 ? 'days' : 'day'

      return [
        fixedDays && `${fixedDays} ${dayWord}`,
        fixedHours && `${fixedHours} hr`,
        fixedMinutes && `${fixedMinutes} min`,
        fixedSeconds && `${fixedSeconds} sec`,
      ]
        .filter(Boolean)
        .join(' ')
    })

    let timerId: number | undefined
    const tick = () => {
      timerId = setTimeout(() => {
        counter.value = Math.max(0, counter.value - 1)
        tick()
      }, 1000) as unknown as number
    }

    watch(
      () => props.remainSecondsForUnstake,
      (remainSecondsForUnstake) => (counter.value = remainSecondsForUnstake)
    )

    onMounted(() => {
      if (isUnstakeDisable.value) {
        tick()
      }
    })
    onBeforeUnmount(() => {
      clearTimeout(timerId)
    })

    return {
      stakerName,
      principalAmount,
      rewardAmount,
      additionalOwner,
      stakingDate,
      unStakingDate,
      proxyStatus,
      isUnstakeDisable,
      timer,
      getters,
    }
  },
  methods: {
    claimReward() {
      this.claimRewardCallback()
    },
  },
})
</script>

<style lang="scss" module>
.section {
  text-align: center;

  &__certimage {
    margin-bottom: 4rem;
  }

  &__icon {
    margin-top: 30px;
    margin-bottom: 30px;
    color: var(--info-section-icon);
    font-size: 128px;
  }

  &__certstatus {
    padding: 0 60px;

    @include media($to: md) {
      padding: 0;
    }
  }

  &__inputlabel {
    margin-bottom: 14px;
    color: var(--info-section-title);
    font-weight: 700;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 0.02px;

    &::before,
    &::after {
      display: block;
      height: 1px;
      margin: 0 -20px;
      background-image: var(--info-section-line);
      content: '';
    }

    &::before {
      margin-bottom: 8px;
    }

    &::after {
      margin-top: 8px;
    }
  }

  &__statuslabel {
    display: flex;
    justify-content: space-between;
  }

  &__unstakingbutton {
    width: 100%;
  }

  &__image {
    width: 360px;
    padding: 5px;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 12px;

    @include media($to: sm) {
      width: 100%;
    }
  }

  &__image:hover {
    box-shadow: 0 0 2px 1px rgb(0 140 186 / 0.5);
  }
}
</style>
