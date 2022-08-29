<template>
  <aside
    ref="containerRef"
    :class="[$style.sidebar, { [$style.sidebar_opened]: isOpened }]"
  >
    <div :class="$style.sidebar__header">
      <TheSidebarAccounts
        v-if="getters.isAuthorized.value"
        :class="$style.sidebar__accounts"
      />
      <BaseLogo v-else :class="$style.sidebar__logo" />
      <button
        type="button"
        :class="$style.sidebar__control"
        @click="$emit('close')"
      />
    </div>
    <nav :class="$style.sidebar__nav">
      <li v-for="item in nav" :key="item.name">
        <a
          v-if="item.isExternal"
          :class="$style.sidebar__link"
          :href="item.link"
          :target="item.target"
        >
          <BaseIcon :name="item.icon" :class="$style.sidebar__icon" />
          {{ item.text }}
        </a>
        <RouterLink
          v-else
          :key="item.name"
          :to="{ name: item.name }"
          :active-class="
            item.name != 'Dashboard' ? $style.sidebar__link_active : ''
          "
          :class="[
            $style.sidebar__link,
            getters.isAuthorized.value ? null : $style.sidebar__disable_link,
          ]"
          :disabled="true"
        >
          <BaseIcon :name="item.icon" :class="$style.sidebar__icon" />
          {{ item.text }}

          <li
            v-for="subItem in item.subItems"
            :key="subItem.name"
            style="margin-left: -50px"
          >
            <RouterLink
              :key="subItem.name"
              :active-class="$style.sidebar__link__subLink_active"
              :to="{ name: subItem.name }"
              :class="[
                $style.sidebar__link__subLink,
                getters.isAuthorized.value
                  ? null
                  : $style.sidebar__disable_link,
              ]"
              :disabled="true"
            >
              {{ subItem.text }}
            </RouterLink>
          </li>
        </RouterLink>
      </li>
    </nav>
    <TheWalletConnectionCard
      v-if="!getters.isAuthorized.value"
      :class="$style.sidebar__card"
    />
    <div v-else :class="$style.sidebar__status">
      METAMASK CONNECTED
      <BaseIcon name="icon-status" :class="$style.sidebar__statusIcon" />
    </div>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import BaseLogo from '../ui/BaseLogo.vue'
import BaseIcon from '../ui/BaseIcon.vue'
import TheWalletConnectionCard from './TheWalletConnectionCard.vue'
import { isElement } from '~/helpers/isElement'
import { useStore } from '~/store'
import TheSidebarAccounts from './TheSidebarAccounts.vue'
import { tokenContractAddress } from '~/constants/addresses'

export default defineComponent({
  name: 'TheSidebar',
  components: {
    BaseLogo,
    BaseIcon,
    TheWalletConnectionCard,
    TheSidebarAccounts,
  },
  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    close: null,
  },
  setup(props, { emit }) {
    const { state, getters } = useStore()

    const nav = computed(() => [
      {
        name: 'Dashboard',
        text: 'Dashboard',
        icon: 'icon-dashboard',
        subItems: [
          {
            name: 'Leaderboard',
            text: 'Leaderboard',
          },
          {
            name: 'Treasury',
            text: 'Treasury',
          },
        ],
      },
      {
        name: 'Portfolio',
        text: 'Portfolio',
        icon: 'icon-portfolio',
      },
      {
        name: 'StakingV2',
        text: 'Staking V2',
        icon: 'icon-staking',
      },
      // {
      //   name: 'StakingApprove',
      //   text: 'Staking',
      //   icon: 'icon-staking',
      // },
      {
        name: 'HowToUse',
        text: 'Buy Novo',
        icon: 'icon-buy-novo',
        isExternal: true,
        link:
          'https://pancakeswap.finance/swap?outputCurrency=' +
          tokenContractAddress,
        target: '_blank',
      },
      {
        name: 'Documentation',
        text: 'Documentation',
        icon: 'icon-documentation',
        isExternal: true,
        link: 'https://novo-2.gitbook.io/welcome-to-gitbook/',
        target: '_blank',
      },
    ])

    const containerRef = ref()

    const onDocumentClick = ({ target }: Event) => {
      const container = containerRef.value

      if (!isElement(container) || !isElement(target)) {
        emit('close')
        return
      }

      if (container.contains(target) || container === target) return

      emit('close')
    }

    watch(
      () => props.isOpened,
      (isOpened: boolean) => {
        if (isOpened) {
          document.addEventListener('click', onDocumentClick, true)
        } else {
          document.removeEventListener('click', onDocumentClick, true)
        }
      }
    )

    return {
      nav,
      containerRef,
      state,
      getters,
    }
  },
})
</script>

<style lang="scss" module>
.sidebar {
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: var(--sidebar-background);

  a.disabled {
    cursor: default;
    pointer-events: none;
  }

  @include hide-scrollbar;

  @include media($to: md) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    transform: translateX(-110%);
    transition: transform 0.3s;
  }

  &_opened {
    @include media($to: md) {
      transform: translateX(0);
    }
  }

  &__header {
    display: flex;
    flex: 0 0 auto;
    justify-content: space-between;
    align-items: center;
    padding: 32px 18px 50px;

    @include media($to: md) {
      padding-right: 70px;
    }
  }

  &__logo {
    height: 40px;
  }

  &__control {
    position: absolute;
    top: 0;
    right: 0;
    flex: 0 0 auto;
    width: 50px;
    height: 50px;
    background: none;

    @include media($from: md) {
      display: none;
    }

    &::before,
    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 24px;
      margin-left: -12px;
      border-top: 2px solid var(--sidebar-link-color);
      content: '';
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }

  &__nav {
    flex: 1 1 auto;
  }

  &__disable_link {
    opacity: 0.5;
    pointer-events: none;
  }

  &__link {
    position: relative;
    display: block;
    padding: 12px 12px 12px 51px;
    color: var(--sidebar-link-color);
    font-weight: 700;
    font-size: 16px;
    line-height: 1;
    letter-spacing: 0.22px;
    transition: color 0.3s, background-color 0.3s;

    &__subLink {
      position: relative;
      display: block;
      padding: 12px 12px 12px 51px;
      color: var(--sidebar-link-color);
      font-weight: 700;
      font-size: 13px;
      line-height: 1;
      letter-spacing: 0.22px;
      transition: color 0.3s, background-color 0.3s;

      &::before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 4px;
        background: var(--sidebar-link-color-active);
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 0.3s;
        content: '';
      }

      &:first-child {
        margin-top: 10px;
      }

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      &_active {
        color: var(--sidebar-link-color-active);
        background: var(--sidebar-link-background-active);

        &::before {
          transform: scaleX(1);
        }
      }
    }

    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 4px;
      background: var(--sidebar-link-color-active);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.3s;
      content: '';
    }

    &:not(:last-child) {
      margin-bottom: 10px;
    }

    &_active {
      color: var(--sidebar-link-color-active);
      background: var(--sidebar-link-background-active);

      &::before {
        transform: scaleX(1);
      }
    }
  }

  &__icon {
    position: absolute;
    top: 11px;
    left: 21px;
    font-size: 17px;
  }

  &__card {
    flex: 0 0 auto;
    margin: 22px;
  }

  &__accounts {
    width: 100%;
  }

  &__status {
    padding: 15px 20px;
    color: rgba(255 255 255 / 0.71);
    font-weight: 700;
    font-size: 10px;
    line-height: 12px;
    text-align: center;
  }

  &__statusIcon {
    margin: -2px 0 -1px;
    color: rgb(72 184 129);
    font-size: 15px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
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
</style>
