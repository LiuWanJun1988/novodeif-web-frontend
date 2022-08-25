<template>
  <div :class="$style.balance">
    <div v-if="status !== null" :class="$style.balance__status">
      <BaseIcon
        name="icon-status"
        :class="[
          $style.balance__statusIcon,
          status
            ? $style.balance__statusIcon_active
            : $style.balance__statusIcon_inactive,
        ]"
      />
      <div :class="$style.balance__statusText">
        {{ statusText }}
      </div>
    </div>
    <BaseIcon :name="icon" :class="$style.balance__icon" />
    <div :class="$style.balance__title">
      {{ title }}
    </div>
    <div :class="$style.balance__container">
      <div :class="$style.balance__label">
        {{ label }}
      </div>
      <button type="button" :class="$style.balance__clear" @click="clear">
        x
      </button>
      <input
        ref="inputRef"
        v-model="value"
        type="text"
        :class="$style.balance__input"
      />
    </div>
    <div :class="$style.balance__meta">
      <div v-if="showMax" :class="$style.balance__total">
        bal: {{ getters.selectedBalance.value }} NOVO
      </div>
      <button
        type="button"
        v-if="showMax"
        :class="$style.balance__max"
        @click="max"
      >
        max
      </button>
    </div>
    <BaseButton
      :ui="!showMax || status ? 'primary' : 'tertiary'"
      size="lg"
      block
      :class="$style.balance__button"
      @click="buttonClick"
      :disabled="showMax && !status"
    >
      {{ buttonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import Inputmask from 'inputmask'
import BaseIcon from './BaseIcon.vue'
import BaseButton from './BaseButton.vue'
import { useStore } from '~/store'

export default defineComponent({
  name: 'EnterBalance',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    status: {
      type: Boolean,
      default: null,
    },
    statusText: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
    showMax: {
      type: Boolean,
      default: true,
    },
    callback: {
      type: Function,
      default: () => 1,
    },
  },
  components: { BaseIcon, BaseButton },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
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
  setup(props, { emit }) {
    const { getters } = useStore()

    const value = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
      },
    })

    const clear = () => {
      inputRef.value.value = 0
      value.value = '0'
    }

    const max = async () => {
      let amount = Math.trunc(getters.selectedBalance.value * 100) / 100
      inputRef.value.value = amount
      value.value = amount.toString()
    }

    const inputRef = ref()
    watch(inputRef, (input) => {
      new Inputmask({
        alias: 'currency',
      }).mask(input)
    })

    return {
      value,
      clear,
      inputRef,
      max,
      getters,
    }
  },
})
</script>

<style lang="scss" module>
.balance {
  position: relative;
  padding: 55px 16px 45px;
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
    opacity: 0.71;
  }

  &__icon {
    margin-bottom: 7px;
    color: var(--balance-icon);
    font-size: 90px;
  }

  &__title {
    margin-bottom: 33px;
    font-weight: 600;
    font-size: 17px;
    letter-spacing: 0.03px;
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
    padding-bottom: 54px;

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
    font-size: 16px;
    line-height: 1;
    letter-spacing: -0.6px;
    background: var(--balance-max-background);
    border: 1px solid var(--balance-max-border);
    border-radius: 2px;
  }

  &__button {
    max-width: 390px;
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
