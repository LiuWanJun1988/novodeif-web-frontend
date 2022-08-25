<template>
  <div :class="$style.section">
    <BaseIcon :name="icon" :class="$style.section__icon" />
    <div :class="$style.section__value">
      <slot name="value" />
    </div>
    <div :class="$style.section__title">
      <slot name="title" />
    </div>
    <div :class="$style.section__text">
      <slot name="text" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseIcon from './BaseIcon.vue'

export default defineComponent({
  name: 'InfoBoxSection',
  components: { BaseIcon },
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" module>
.section {
  text-align: center;

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
    padding: 0 20px;
    color: var(--info-section-text);
    font-weight: 500;
    font-size: 13px;
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
}
</style>
