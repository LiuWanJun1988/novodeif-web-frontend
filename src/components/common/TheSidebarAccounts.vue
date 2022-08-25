<template>
  <div :class="$style.accounts">
    <button :class="$style.accounts__control">
      <BaseIcon name="icon-logo-circle" :class="$style.accounts__logo" />
      <span :class="$style.accounts__content">
        <strong :class="$style.accounts__title">
          {{ getters.selectedAccountShort.value }}
        </strong>
        <span :class="$style.accounts__balance">
          Bal: {{ convertToNovo(getters.selectedBalance.value) }} NOVO
        </span>
      </span>
      <BaseIcon
        v-if="state.accounts.length > 1"
        name="icon-arrow-down"
        :class="$style.accounts__arrow"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '~/store'
import BaseIcon from '../ui/BaseIcon.vue'
import { convertToNovo } from '~/helpers/convertToCurrency'

export default defineComponent({
  name: 'TheHeaderAccounts',
  setup() {
    const { state, getters } = useStore()
    return {
      state,
      getters,
      convertToNovo,
    }
  },
  components: { BaseIcon },
})
</script>

<style lang="scss" module>
.accounts {
  position: relative;

  &__control {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 38px;
    padding: 2px 20px 0 0;
    color: #fff;
    text-align: left;
    background: none;
    border: 0;
  }

  &__logo {
    flex: 0 0 auto;
    margin-right: 12px;
    font-size: 40px;
  }

  &__title,
  &__balance {
    display: block;
  }

  &__title {
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 0.38px;
  }

  &__balance {
    color: #deccef;
    font-weight: 500;
    font-size: 11px;
    line-height: 12px;
  }

  &__arrow {
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -0.5em;
    font-size: 7px;
  }

  &__content {
    flex: 1 1 auto;
  }
}
</style>
