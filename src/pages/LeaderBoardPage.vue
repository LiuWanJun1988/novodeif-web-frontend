<template>
  <div :class="$style.page">
    <div :class="$style.page__container">
      <FollowNovo :class="$style.page__follow" />
      <TheLoadingScreen v-if="isLoading"></TheLoadingScreen>
      <div
        v-if="!isLoading && getters.isAuthorized.value"
        :class="$style.page__stats"
      >
        <div :class="$style.stats">
          <BaseIcon name="icon-cup" :class="$style.stats__icon" />
          <div :class="$style.stats__item" style="padding-left: 20px">
            <div :class="$style.stats__label">CURRENT TIME-KEEPER</div>
            <div :class="$style.stats__sum">
              {{ timeKeeperST }}
            </div>
          </div>
          <div :class="$style.stats__item">
            <div :class="$style.stats__label">WALLET-ADDRESS</div>
            <div :class="$style.stats__sum">{{ timeKeeperAddress }}</div>
            <div :class="$style.stats__result">
              <strong>{{ timeKeeperNS.toFixed(3) }}</strong>
              <span>: Novo Score</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!isLoading && getters.isAuthorized.value"
        :class="$style.page__transactions"
      >
        <BaseTable :columns="tableColumns" :data="stakesInfo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import FollowNovo from '~/components/ui/FollowNovo.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseTable from '~/components/ui/BaseTable.vue'
import TheLoadingScreen from '~/components/common/TheLoadingScreen.vue'

import { useStore } from '~/store'
import { ethers } from 'ethers'

export default defineComponent({
  name: 'LeaderBoardPage',
  components: { FollowNovo, BaseTable, BaseIcon, TheLoadingScreen },
  data: () => ({
    timeKeeperAddress: '', // timeKeeper wallet address
    timeKeeperST: '', // timeKeeper staked time
    timeKeeperNS: 0.0, // timeKeeper novo score
    stakesInfo: [],
    isLoading: false,
  }),
  watch: {
    isAuthorized: function () {
      this.getLeaderBoardInfo()
    },
  },
  async mounted() {
    this.getLeaderBoardInfo()
  },
  methods: {
    async getLeaderBoardInfo() {
      this.isLoading = true
      if (this.getters.isAuthorized.value == false) {
        this.isLoading = false
        return
      }
      let timeKeeper = await this.methods.getNcosContract().getTimeKeeper()
      let timeStaked = Number(
        ethers.utils.formatUnits(
          timeKeeper.currentTimestamp - timeKeeper.stakeInfo.stakingTimestamp,
          0
        )
      )
      let oneMinute = 60,
        oneHour = oneMinute * 60,
        oneDay = oneHour * 24

      this.timeKeeperAddress = [
        timeKeeper.stakerAddress.slice(0, 5),
        timeKeeper.stakerAddress.slice(-4),
      ].join('...')

      this.timeKeeperST = `${Math.floor(
        timeStaked / oneDay
      )} days : ${Math.floor(
        (timeStaked % oneDay) / oneHour
      )} hrs : ${Math.floor(
        (timeStaked % oneHour) / oneMinute
      )} mins : ${Math.floor(timeStaked % oneMinute)} secs`

      this.timeKeeperNS = Number(
        ethers.utils.formatUnits(timeKeeper.novoScore, 18)
      )

      let allStakers = await this.methods.getNcosContract().getAllStakers()
      let numberOfStakers = allStakers.length
      let currentTimestamp = Number(
        ethers.utils.formatUnits(timeKeeper.currentTimestamp, 0)
      )

      for (let i = 0; i < numberOfStakers; i++) {
        let stakeInfo = await this.methods
          .getNcosContract()
          .getStakingStatusByAddress(allStakers[i])
        let row = {
          wallet: stakeInfo.stakerAddress,
          timeStaked:
            currentTimestamp -
            Number(
              ethers.utils.formatUnits(stakeInfo.stakeInfo.stakingTimestamp, 0)
            ),
          novoScore: Number(ethers.utils.formatUnits(stakeInfo.novoScore, 18)),
        }
        this.stakesInfo.push(row)
      }
      this.stakesInfo.sort(function (a, b) {
        return b.novoScore - a.novoScore
      })

      if (this.stakesInfo.length > 21) {
        this.stakesInfo = this.stakesInfo.slice(0, 21)
      }
      this.isLoading = false
    },
  },
  setup() {
    const { getters, methods } = useStore()
    const isAuthorized = computed(() => {
      return getters.isAuthorized.value
    })

    const tableColumns = [
      {
        id: 1,
        text: 'RANK',
      },
      {
        id: 2,
        text: 'WALLET',
      },
      {
        id: 3,
        text: 'TIME STAKED (SEC)',
      },
      {
        id: 4,
        text: 'NOVO SCORE',
      },
    ]

    return {
      tableColumns,
      getters,
      methods,
      isAuthorized,
    }
  },
})
</script>

<style lang="scss" module>
.page {
  max-width: 1194px;
  margin: 0 auto;

  &__container {
    position: relative;
    padding: 38px;

    @include media($to: sm) {
      padding: 40px 24px;
    }

    @include media($to: xs) {
      padding: 40px 16px;
    }
  }

  &__follow {
    margin-bottom: 30px;
  }

  &__stats {
    margin-bottom: 45px;
    overflow: hidden;
  }

  &__title {
    margin-bottom: 7px;
    font-size: 16px;
    line-height: 17px;
    letter-spacing: 0.22px;
  }

  &__text {
    margin-bottom: 32px;
    color: var(--profile-text);
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.02px;
  }
}

.stats {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin: -50px;

  @include media($to: xl) {
    margin: -25px;
  }

  &__icon {
    margin-top: 50px;
    margin-bottom: 22px;
    margin-left: 50px;
    color: var(--info-section-icon2);
    font-size: 60px;
  }

  &__item {
    position: relative;
    flex: 0 0 auto;
    max-width: 100%;
    padding: 50px;
    overflow: hidden;

    @include media($to: xl) {
      padding: 25px;
      padding-right: 50px;
    }

    &:not(:first-child) {
      padding-left: 50px;
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
