<template>
  <div :class="$style.section">
    <BaseIcon :name="icon" :class="$style.section__icon" />
    <h2>
      {{
        isNewMintDisable
          ? 'Can not mint a new certificate!'
          : 'Main Certificate of Stake'
      }}
    </h2>
    <div :class="$style.section__title">
      <slot name="title" />
    </div>
    <div :class="$style.section__input">
      <label :class="$style.section__inputlabel" for="name"
        >Stake Name (Optional)</label
      >
      <input
        type="text"
        id="name"
        placeholder="Type in a name for your stake ..."
        v-model="stakerName"
        :class="$style.section__textinput"
      />
    </div>
    <div :class="$style.section__input">
      <div :class="$style.section__amountlabel">
        <label :class="$style.section__inputlabel" for="amount">Amount *</label>
        <span :class="$style.section__inputlabel"
          >Bal: {{ getters.selectedBalance.value.toFixed(2) }} NOVO</span
        >
      </div>
      <input
        ref="inputRef"
        type="text"
        id="amount"
        placeholder="Type in a amount to stake ..."
        v-model="stakingAmount"
        :class="$style.section__textinput"
      />
      <div :class="$style.section__setamount">
        <BaseButton
          ui="stroke"
          size="sm"
          :class="
            is25Percent
              ? $style.section__activeamountbutton
              : $style.section__amountbutton
          "
          @click="updateStakingAmount(0.25)"
          >25%</BaseButton
        >
        <BaseButton
          ui="stroke"
          size="sm"
          :class="
            is50Percent
              ? $style.section__activeamountbutton
              : $style.section__amountbutton
          "
          @click="updateStakingAmount(0.5)"
          >50%</BaseButton
        >
        <BaseButton
          ui="stroke"
          size="sm"
          :class="
            is75Percent
              ? $style.section__activeamountbutton
              : $style.section__amountbutton
          "
          @click="updateStakingAmount(0.75)"
          >75%</BaseButton
        >
        <BaseButton
          ui="stroke"
          size="sm"
          :class="
            is100Percent
              ? $style.section__activeamountbutton
              : $style.section__amountbutton
          "
          @click="updateStakingAmount(1.0)"
          >max</BaseButton
        >
      </div>
    </div>
    <div :class="$style.section__input">
      <label :class="$style.section__inputlabel" for="addtional"
        >Add Additional Owner (Optional)</label
      >
      <input
        type="text"
        id="addtional"
        placeholder="Paste Wallet Address"
        v-model="additionalOwner"
        :class="$style.section__textinput"
      />
    </div>
    <div :class="$style.section__input">
      <label :class="$style.section__inputlabel">Proxy Growth Status</label>
      <BaseButton
        ui="stroke"
        size="sm"
        :class="
          isProxyActive ? $style.section__activebutton : $style.section__button
        "
        @click="doActive()"
        >Active</BaseButton
      >
      <BaseButton
        ui="stroke"
        size="sm"
        :class="
          !isProxyActive ? $style.section__activebutton : $style.section__button
        "
        @click="doInactive()"
        >Inactive</BaseButton
      >
    </div>
    <div :class="$style.section__text">
      <slot name="text" />
    </div>
    <div :class="$style.section__setamount">
      <BaseButton
        ui="stroke"
        size="md"
        :class="$style.section__resetbutton"
        @click="reset()"
        >Reset</BaseButton
      >
      <BaseButton
        ui="primary"
        size="md"
        :disabled="isNewMintDisable ? true : stakingAmount == ''"
        :class="$style.section__mintbutton"
        @click="mint()"
        >Mint Certifcate of Stake</BaseButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Inputmask from 'inputmask'
import { useStore } from '~/store'
import BaseIcon from './BaseIcon.vue'
import BaseButton from './BaseButton.vue'

export default defineComponent({
  name: 'CertificateMintSection',
  components: { BaseIcon, BaseButton },
  props: {
    icon: {
      type: String,
      required: true,
    },
    isNewMintDisable: {
      type: Boolean,
      required: true,
      default: true,
    },
    mintCallback: {
      type: Function,
      required: true,
      default: () => ({
        stakerName: '',
        stakingAmount: 0,
        additionalOwner: '',
        isProxyActive: true,
      }),
    },
  },
  data: () => ({
    isProxyActive: true,
    is25Percent: false,
    is50Percent: false,
    is75Percent: false,
    is100Percent: false,
    stakerName: '',
    stakingAmount: '',
    additionalOwner: '',
  }),
  setup() {
    const { getters } = useStore()

    const inputRef = ref()
    watch(inputRef, (input) => {
      new Inputmask({
        alias: 'currency',
      }).mask(input)
    })

    return {
      inputRef,
      getters,
    }
  },
  methods: {
    mint() {
      this.mintCallback({
        stakerName: this.stakerName,
        stakingAmount: this.stakingAmount,
        additionalOwner: this.additionalOwner,
        isProxyActive: this.isProxyActive,
      })
    },
    reset() {
      this.stakerName = ''
      this.stakingAmount = ''
      this.additionalOwner = ''
      this.isProxyActive = true
      this.resetAmountButtons()
    },
    resetAmountButtons() {
      this.is25Percent = false
      this.is50Percent = false
      this.is75Percent = false
      this.is100Percent = false
    },
    doActive() {
      this.isProxyActive = true
    },
    doInactive() {
      this.isProxyActive = false
    },
    updateStakingAmount(percentage: number) {
      this.resetAmountButtons()
      this.stakingAmount = Math.trunc(
        this.getters.selectedBalance.value * percentage
      ).toString()
      if (percentage == 0.25) {
        this.is25Percent = true
      } else if (percentage == 0.5) {
        this.is50Percent = true
      } else if (percentage == 0.75) {
        this.is75Percent = true
      } else if (percentage == 1.0) {
        this.is100Percent = true
      }
    },
  },
})
</script>

<style lang="scss" module>
.section {
  // text-align: center;

  &__icon {
    margin-bottom: 22px;
    color: var(--info-section-icon);
    font-size: 30px;
  }

  &__value {
    margin-bottom: 8px;
    color: var(--info-section-value);
    font-weight: 600;
    font-size: 17px;
    line-height: 1;
    letter-spacing: 0.03px;
  }

  &__title {
    margin-bottom: 14px;
    color: var(--info-section-title);
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 0.02px;
  }

  &__text {
    margin-bottom: 1rem;
    color: var(--info-section-text);
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: -0.48px;

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

  &__textinput {
    display: block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    margin-bottom: 2.5rem;
    padding: 0.375rem 0.75rem;
    color: #495057;
    font-weight: 400;
    font-size: 0.9rem;
    line-height: 1.5;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  &__button {
    min-width: 120px;
    margin-right: 1rem;
    margin-bottom: 25px;
  }

  &__amountbutton {
    width: 40px;
    min-width: 10px;
    height: 25px;
    margin-top: -25px;
    margin-bottom: 25px;
    margin-left: 0.5rem;
  }

  &__activeamountbutton {
    width: 40px;
    min-width: 10px;
    height: 25px;
    margin-top: -25px;
    margin-bottom: 25px;
    margin-left: 0.5rem;
    color: rgb(72 184 129);
    background: rgb(229 245 237);
    border: rgb(72 184 129) solid 2px;
  }

  &__setamount {
    text-align: right;
  }

  &__amountlabel {
    display: flex;
    justify-content: space-between;
  }

  &__activebutton {
    min-width: 120px;
    margin-right: 1rem;
    margin-bottom: 25px;
    color: rgb(72 184 129);
    background: rgb(229 245 237);
    border: rgb(72 184 129) solid 2px;
  }

  &__mintbutton {
    margin-left: 10px;
  }
}
</style>
