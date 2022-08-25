<template>
  <div :class="$style.card">
    <BaseIcon :name="icon" :class="$style.card__icon" />
    <div :class="$style.card__title">
      {{ value }}
    </div>
    <div :class="$style.card__label">
      {{ label }}
    </div>
    <BaseButton
      ui="stroke"
      size="sm"
      :class="$style.card__button"
      @click="doDetail()"
    >
      {{ buttonText }}
    </BaseButton>
    <div :class="$style.card__description">
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseIcon from './BaseIcon.vue'
import BaseButton from './BaseButton.vue'

export default defineComponent({
  name: 'BaseCard',
  components: { BaseIcon, BaseButton },
  props: {
    icon: {
      type: String,
      required: true,
    },
    value: {
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
    description: {
      type: String,
      default: '',
    },
    detailLink: {
      type: String,
      default: '',
    },
  },
  methods: {
    doDetail() {
      window.open(this.detailLink, '_blank')
    },
  },
})
</script>

<style lang="scss" module>
.card {
  position: relative;
  padding: 37px 16px 26px;
  text-align: center;
  border: 1px solid var(--card-border);

  &__icon {
    margin-bottom: 21px;
    color: #86719a;
    font-size: 30px;
  }

  &__title {
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 17px;
    line-height: 1;
    letter-spacing: 0.03px;
  }

  &__label {
    margin-bottom: 16px;
    color: var(--card-label);
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 0.02px;
  }

  &__button {
    min-width: 120px;
    margin-bottom: 25px;
  }

  &__description {
    color: var(--card-description);
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    letter-spacing: -0.48px;

    &::before,
    &::after {
      display: block;
      height: 1px;
      background-image: var(--card-line);
      content: '';
    }

    &::before {
      margin-bottom: 6px;
    }

    &::after {
      margin-top: 8px;
    }

    p {
      max-width: 183px;
      margin: 0 auto;
    }
  }
}
</style>
