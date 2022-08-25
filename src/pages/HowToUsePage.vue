<template>
  <div :class="$style.page">
    <div :class="$style.page__container">
      <DetailsDescription :class="$style.page__content">
        <template #label> HOW TO USE NOVO PAY </template>
        <template #title> Why do I need to buy BNB (Smart Chain) </template>
        <template #description>
          We know it may seem strange but in order to buy Novo, you will need to
          purchase BNB which is the native token on the Binance Smart Chain.
          Since Novo is a BEP-20 token, it requires a swap from BNB to NOVO. We
          will take care of all the swapping, you simply need to buy some BNB in
          the next step.
        </template>
        <template #footer="{ classList }">
          <BaseButton
            tag="RouterLink"
            ui="primary"
            size="sm"
            :to="{ name: 'NovoPay' }"
            :class="classList.button"
          >
            Continue to Novo Pay
          </BaseButton>
        </template>
      </DetailsDescription>
      <TheNovoPayFigure :class="$style.page__image" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import TheNovoPayFigure from '~/components/common/TheNovoPayFigure.vue'
import DetailsDescription from '~/components/ui/DetailsDescription.vue'

export default defineComponent({
  name: 'NovoPayHowToUsePage',
  components: {
    BaseButton,
    TheNovoPayFigure,
    DetailsDescription,
  },
})
</script>

<style lang="scss" module>
.page {
  max-width: 1194px;
  margin: 0 auto;

  &__container {
    max-width: 1131px;
    padding: 20px 40px;

    @include media($from: sm) {
      display: flex;
      align-items: flex-start;
    }

    @include media($to: sm) {
      padding: 40px 24px;
    }
  }

  &__content {
    @include media($from: sm) {
      flex: 1 1 auto;
      max-width: 556px;
      padding: 23px 40px 0 0;
    }
  }

  &__image {
    display: block;
    max-width: 452px;

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
