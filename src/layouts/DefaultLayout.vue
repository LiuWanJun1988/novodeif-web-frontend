<template>
  <div :class="$style.layout">
    <TheSidebar
      :class="$style.layout__sidebar"
      :is-opened="isOpenedNav"
      @close="closeNav"
    />
    <div :class="$style.layout__content">
      <TheHeader :class="$style.layout__header" @toggle-nav="toggleNav" />
      <div :class="$style.layout__container">
        <slot />
      </div>
    </div>
    <ModalConfirmSwap />
    <ModalConnectWallet />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheSidebar from '~/components/common/TheSidebar.vue'
import TheHeader from '~/components/common/TheHeader.vue'
import ModalConfirmSwap from '~/components/modals/ModalConfirmSwap.vue'
import ModalConnectWallet from '~/components/modals/ModalConnectWallet.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: { TheSidebar, TheHeader, ModalConfirmSwap, ModalConnectWallet },
  data: () => ({
    isOpenedNav: false,
  }),
  watch: {
    '$route.name'(next, prev) {
      if (next !== prev && this.isOpenedNav) this.closeNav()
    },
  },
  methods: {
    toggleNav() {
      this.isOpenedNav = !this.isOpenedNav
    },
    closeNav() {
      this.isOpenedNav = false
    },
  },
})
</script>

<style lang="scss" module>
.layout {
  display: flex;

  &__sidebar {
    flex: 0 0 auto;
    width: 246px;
    height: 100vh;

    @include media($to: md) {
      width: 300px;
    }
  }

  &__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    height: 100vh;
  }

  &__header {
    flex: 0 0 auto;
  }

  &__container {
    flex: 1 1 auto;
    overflow: auto;
  }
}
</style>
