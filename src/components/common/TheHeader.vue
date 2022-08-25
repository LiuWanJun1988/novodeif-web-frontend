<template>
  <header :class="$style.header">
    <div :class="$style.header__container">
      <button
        type="button"
        :class="$style.header__control"
        @click="$emit('toggleNav')"
      >
        <span />
      </button>
      <h1 :class="$style.header__title">
        {{ $route.meta.title }}
      </h1>
      <div :class="$style.header__actions">
        <TheThemeButton :class="$style.header__theme" />
        <TheHeaderAccounts v-if="getters.isAuthorized.value" />
        <BaseButton
          v-else
          ui="secondary-stroke"
          size="sm"
          :class="$style.header__connect"
          @click="openConnectWallet"
        >
          <strong>CONNECT WALLET</strong>
        </BaseButton>
      </div>
    </div>
    <div v-if="tabs.length" :class="$style.header__tabs">
      <RouterLink
        v-for="item in tabs"
        :key="item.id"
        :to="item.target"
        :class="
          item.disabled && item.disabled()
            ? [$style.header__tab, $style.header__tab_disabled]
            : $style.header__tab
        "
        :exact-active-class="$style.isActive"
      >
        {{ item.text }}
      </RouterLink>
    </div>
    <BaseAlert ref="alertRef" :ui="alertProperty.style">
      {{ alertProperty.message }}
    </BaseAlert>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import TheThemeButton from './TheThemeButton.vue'
import BaseButton from '../ui/BaseButton.vue'
import { isValidTabs } from '~/helpers/isValidTabs'
import { useRoute } from 'vue-router'
import { useStore } from '~/store'
import TheHeaderAccounts from './TheHeaderAccounts.vue'
import BaseAlert from '../ui/BaseAlert.vue'
import { emitter } from '~/services/emitter'

export default defineComponent({
  name: 'TheHeader',
  components: { TheThemeButton, BaseButton, TheHeaderAccounts, BaseAlert },
  emits: {
    toggleNav: null,
  },
  methods: {
    openConnectWallet() {
      emitter.emit('connectWallet:open')
    },
  },
  setup() {
    const route = useRoute()

    const tabs = computed(() =>
      isValidTabs(route.meta.tabs)
        ? route.meta.tabs.map((item) => ({
            id: item.page,
            target: { name: item.page },
            text: item.text,
            disabled: item.disabled,
          }))
        : []
    )

    const { state, getters, methods } = useStore()

    const alertProperty = computed(() => getters.alertProperty.value)

    const alertRef = ref()

    const open = () => alertRef.value?.open()
    const close = () => alertRef.value?.close()

    onMounted(() => {
      emitter.on('alert:open', open)
      emitter.on('alert:close', close)
    })

    onUnmounted(() => {
      emitter.off('alert:open', open)
      emitter.off('alert:close', close)
    })

    return { state, getters, methods, tabs, alertRef, alertProperty }
  },
})
</script>

<style lang="scss" module>
.header {
  position: relative;
  padding: 0 22px 0 40px;
  background: var(--header-background);
  border-bottom: 1px solid var(--header-border);

  @include media($to: md) {
    padding: 0 16px;
  }

  &__container {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 66px;
    padding: 14px 0;
  }

  &__tabs {
    display: flex;
  }

  &__tab {
    position: relative;
    margin-bottom: -1px;
    padding: 12px 0 13px;
    color: var(--tabs-color);
    font-weight: 600;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.17px;

    &_disabled {
      cursor: not-allowed !important;
    }

    &.isActive {
      &::before {
        transform: scaleX(1);
        opacity: 1;
      }
    }

    &:not(:last-child) {
      margin-right: 25px;
    }

    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: 2px solid var(--tabs-border);
      transform: scaleX(0);
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
      content: '';
    }
  }

  &__title {
    padding-top: 5px;
    font-size: 16px;
    line-height: 17px;
    letter-spacing: 0.22px;

    @include media($to: xs) {
      display: none;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
  }

  &__theme {
    margin-right: 20px;
  }

  &__connect {
    @include media($from: md) {
      margin-right: 50px;
    }

    strong {
      text-transform: uppercase;
    }
  }

  &__control {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    color: inherit;
    background: none;

    @include media($from: md) {
      display: none;
    }

    &::before,
    &::after {
      content: '';
    }

    &::before,
    &::after,
    span {
      display: block;
      width: 28px;
      border-top: 2px solid currentColor;
    }

    &::before {
      margin-bottom: 4px;
    }

    &::after {
      margin-top: 4px;
    }
  }
}
</style>
