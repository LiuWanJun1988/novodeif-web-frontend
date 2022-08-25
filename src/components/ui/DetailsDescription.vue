<template>
  <div :class="$style.details">
    <BaseLabel :class="$style.details__label">
      <slot name="label" />
    </BaseLabel>
    <BaseText ui="title" :class="$style.details__title">
      <slot name="title" />
    </BaseText>
    <BaseText ui="description" :class="$style.details__description">
      <slot name="description" />
    </BaseText>
    <div :class="$style.details__buttons">
      <slot
        name="footer"
        :class-list="{
          button: $style.details__button,
          divider: $style.details__divider,
          link: $style.details__link,
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseText from '~/components/ui/BaseText.vue'
import BaseLabel from '~/components/ui/BaseLabel.vue'

export default defineComponent({
  name: 'DetailsDescription',
  components: {
    BaseText,
    BaseLabel,
  },
})
</script>

<style lang="scss" module>
.details {
  &__label {
    margin-bottom: 40px;
  }

  &__title {
    margin-bottom: 16px;
  }

  &__description {
    margin-bottom: 20px;
  }

  &__buttons {
    display: flex;
    align-items: center;
  }

  &__divider {
    padding: 0 12px 0 10px;
    color: #6a708c;
    font-weight: 500;
    font-size: 13px;
    line-height: 1;
    letter-spacing: -0.18px;
  }

  &__link {
    padding-top: 2px;
    color: #36f;
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 0.05px;
  }
}
</style>
