<template>
  <div :class="$style.unstake">
    <div v-if="status !== null" :class="$style.unstake__status">
      <BaseIcon
        name="icon-status"
        :class="[
          $style.unstake__statusIcon,
          status
            ? $style.unstake__statusIcon_active
            : $style.unstake__statusIcon_inactive,
        ]"
      />
      <div :class="$style.unstake__statusText">
        {{ statusText }}
      </div>
    </div>
    <div :class="$style.unstake__navigation">
      <button
        type="button"
        :disabled="index <= 0"
        :class="$style.unstake__control"
        @click.prevent="decrement"
      >
        <BaseIcon name="icon-angle-prev" :class="$style.unstake__arrow" />
      </button>
      <div :class="$style.unstake__counter">
        STAKE {{ length > 0 ? index + 1 : 0 }} of {{ length }}
      </div>
      <button
        type="button"
        :disabled="index >= length - 1"
        :class="$style.unstake__control"
        @click.prevent="increment"
      >
        <BaseIcon name="icon-angle-next" :class="$style.unstake__arrow" />
      </button>
    </div>
    <div :class="$style.unstake__container">
      <div :class="$style.unstake__label">
        {{ label }}
      </div>
      <button type="button" :class="$style.unstake__clear" @click="clear">
        x
      </button>
      <input
        ref="inputRef"
        v-model="value"
        type="text"
        :class="$style.unstake__input"
      />
    </div>
    <div :class="$style.unstake__meta">
      <button type="button" :class="$style.unstake__max" @click="max">
        max
      </button>
    </div>
    <div :class="$style.unstake__main">
      <div :class="$style.unstake__grid">
        <div :class="$style.unstake__gridHeader">
          <div :class="$style.unstake__gridTitle">NOVO</div>
          <div :class="$style.unstake__gridTitle">USDT EQV</div>
        </div>
        <div :class="$style.unstake__gridBody">
          <div
            v-for="item in items"
            :key="item.id"
            :class="$style.unstake__gridRow"
          >
            <div :class="$style.unstake__gridLabel">
              {{ item.label }}
            </div>
            <div :class="$style.unstake__gridValue">
              {{ convertToNovo(item.values[0]) }}
            </div>
            <div :class="$style.unstake__gridValue">
              {{ convertToUSD(item.values[1]) }}
            </div>
          </div>
        </div>
      </div>
      <BaseButton
        :ui="status ? 'primary' : 'tertiary'"
        size="lg"
        block
        :class="$style.unstake__button"
        :disabled="!status"
        @click="buttonClick"
      >
        <BaseIcon
          name="icon-security-time"
          :class="$style.unstake__buttonIcon"
        />
        <CountDown v-if="seconds" :seconds="seconds" />
        <template v-else>
          {{ buttonText }}
        </template>
      </BaseButton>
      <div :class="$style.unstake__footnote">
        <span> STAKING ADDRESS: {{ shortAddress }} </span>
        <button
          type="button"
          :class="$style.unstake__footnoteCopy"
          @click="copy"
        >
          <BaseIcon name="icon-copy" :class="$style.unstake__footnoteIcon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, PropType } from 'vue'
import Inputmask from 'inputmask'
import BaseIcon from './BaseIcon.vue'
import BaseButton from './BaseButton.vue'
import copyToClipboard from '~/helpers/copyToClipboard'
import { convertToNovo, convertToUSD } from '~/helpers/convertToCurrency'
import CountDown from './CountDown.vue'

export default defineComponent({
  name: 'UnstakeDetails',
  components: { BaseIcon, BaseButton, CountDown },
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    statusText: {
      type: String,
      default: '',
    },
    status: {
      type: Boolean,
      default: null,
    },
    buttonText: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    values: {
      type: Object as PropType<{
        unstaked: number[]
        staked: number[]
        rewards: number[]
        stakedBalance: number[]
        totalBalance: number[]
      }>,
      default: () => ({}),
    },
    callback: {
      type: Function,
      default: () => 1,
    },
    seconds: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
    },
    length: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    buttonClick() {
      if (this.callback) {
        const currentBalance = Number(this.inputRef.value.replaceAll(',', ''))
        if (currentBalance <= 0.0) return
        this.$emit('update:modelValue', currentBalance.toFixed(2))
        this.callback()
      }
    },
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    'update:index': (index: number) =>
      typeof index === 'number' && isFinite(index),
  },
  setup(props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: (value: string) => emit('update:modelValue', value),
    })

    const max = async () => {
      let amount = Math.trunc(props.values.staked[0] * 100) / 100
      inputRef.value.value = amount
      value.value = amount.toString()
    }

    const inputRef = ref()
    watch(inputRef, (input) => {
      new Inputmask({
        alias: 'currency',
      }).mask(input)
    })

    const items = computed(() => [
      {
        id: 1,
        label: 'Unstaked',
        values: props.values.unstaked,
      },
      {
        id: 2,
        label: 'Staked',
        values: props.values.staked,
      },
      {
        id: 3,
        label: 'Rewards',
        values: props.values.rewards,
      },
      {
        id: 4,
        label: 'Staked Balance',
        values: props.values.stakedBalance,
      },
      {
        id: 5,
        label: 'Total Balance',
        values: props.values.totalBalance,
      },
    ])

    const copy = () => copyToClipboard(props.address)

    const clear = () => {
      inputRef.value.value = 0
      value.value = '0'
    }

    const shortAddress = computed(() => {
      if (props.address) {
        const address = props.address
        return [address.slice(0, 6), address.slice(-6)].join('...')
      } else {
        return ''
      }
    })

    const resolveIndex = (index: number) =>
      Math.max(0, Math.min(index, props.length - 1))
    const increment = () => emit('update:index', resolveIndex(props.index + 1))
    const decrement = () => emit('update:index', resolveIndex(props.index - 1))

    return {
      value,
      inputRef,
      items,
      copy,
      max,
      shortAddress,
      convertToNovo,
      convertToUSD,
      increment,
      decrement,
      clear,
    }
  },
})
</script>

<style lang="scss" module>
.unstake {
  position: relative;
  padding: 55px 16px 15px;
  text-align: center;
  background: var(--balance-background);
  border: 1px solid var(--balance-border);
  border-radius: 3px;

  &__status {
    position: absolute;
    top: 14px;
    left: 16px;
    display: flex;
    align-items: center;
  }

  &__statusIcon {
    margin-right: 6px;
    font-size: 17px;
    border-radius: 50%;

    &_active {
      color: var(--success);
      animation: pulse-active 2s infinite;
    }

    &_inactive {
      color: var(--danger);
      animation: pulse-inactive 2s infinite;
    }
  }

  &__statusText {
    color: var(--balance-status-text);
    font-weight: 700;
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;
    text-transform: uppercase;
    opacity: 0.71;
  }

  &__container {
    position: relative;

    &::before,
    &::after {
      display: block;
      height: 1px;
      background-image: var(--balance-line);
      content: '';
    }
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2px;

    @include media($from: sm) {
      padding-right: 33px;
      padding-left: 33px;
    }
  }

  &__total {
    color: var(--balance-total);
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    letter-spacing: -0.48px;
  }

  &__max {
    margin-left: auto;
    padding: 0 6px;
    color: var(--balance-max-color);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.6px;
    background: var(--balance-max-background);
    border: 1px solid var(--balance-max-border);
    border-radius: 2px;
  }

  &__input {
    display: block;
    width: 100%;
    height: 70px;
    padding: 0 90px;
    color: var(--balance-input-color);
    font-weight: 700;
    font-size: 30px;
    line-height: normal;
    letter-spacing: 0.6px;
    text-align: center !important;
    background: none;

    @include media($to: sm) {
      padding: 0 50px;
      font-size: 24px;
    }
  }

  &__label {
    position: absolute;
    top: 30px;
    left: 57px;
    color: var(--balance-label);
    font-weight: 700;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 0.02px;
    text-transform: uppercase;

    @include media($from: sm) {
      transform: translateX(-50%);
    }

    @include media($to: sm) {
      left: 0;
    }
  }

  &__clear {
    position: absolute;
    top: 15px;
    right: 30px;
    height: 20px;
    color: var(--balance-clear);
    font-weight: 700;
    font-size: 20px;
    line-height: 1;
    letter-spacing: 0.4px;
    background: none;

    @include media($to: sm) {
      right: 0;
    }
  }

  &__main {
    max-width: 390px;
    margin: 0 auto;
  }

  &__buttonIcon {
    margin-right: 8px;
    color: #7f3939;
    font-size: 30px;
  }

  &__footnote {
    margin-top: 16px;
    color: var(--balance-status-text);
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;

    span {
      opacity: 0.71;
    }
  }

  &__footnoteCopy {
    display: inline-block;
    margin-left: 8px;
    vertical-align: top;
    background: none;
  }

  &__footnoteIcon {
    margin-top: -2px;
    color: var(--balance-icon);
    font-size: 15px;
  }

  &__grid {
    margin: 28px 0 24px;
    color: rgb(var(--unstake-details-grid-rgb));
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    letter-spacing: -0.48px;
  }

  &__gridHeader,
  &__gridRow {
    display: flex;
    align-items: flex-start;
  }

  &__gridHeader {
    justify-content: flex-end;
  }

  &__gridRow {
    margin-top: 13px;
  }

  &__gridValue,
  &__gridTitle {
    flex: 0 0 auto;
    width: 110px;
    text-align: right;

    @include media($to: xxs) {
      width: 80px;
    }
  }

  &__gridTitle {
    opacity: 0.66;
  }

  &__gridLabel {
    flex: 1 1 auto;
    text-align: left;
  }

  &__navigation {
    position: absolute;
    top: 15px;
    right: 20px;
    display: flex;
    color: var(--balance-status-text);
    opacity: 0.7;
  }

  &__control {
    margin: -14px 0 0;
    padding: 15px;
    color: inherit;
    font-size: 0;
    background: none;

    @include disabled {
      visibility: hidden;
      opacity: 0;
    }
  }

  &__arrow {
    font-size: 12px;
  }

  &__counter {
    font-weight: 700;
    font-size: 12px;
    line-height: 17px;
  }
}

@keyframes pulse-active {
  0% {
    box-shadow: 0 0 0 0 rgb(72 184 129 / 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgb(72 184 129 / 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgb(72 184 129 / 0);
  }
}

@keyframes pulse-inactive {
  0% {
    box-shadow: 0 0 0 0 rgb(208 2 27 / 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgb(208 2 27 / 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgb(208 2 27 / 0);
  }
}
</style>
