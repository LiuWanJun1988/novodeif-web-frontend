<template>
  <component
    :is="tag"
    :type="computedType"
    :class="[
      $style.button,
      {
        [$style.button_sm]: size === 'sm',
        [$style.button_md]: size === 'md',
        [$style.button_xmd]: size === 'xmd',
        [$style.button_lg]: size === 'lg',
        [$style.button_default]: ui === 'default',
        [$style.button_primary]: ui === 'primary',
        [$style.button_secondary]: ui === 'secondary',
        [$style.button_secondaryStroke]: ui === 'secondary-stroke',
        [$style.button_stroke]: ui === 'stroke',
        [$style.button_strokeOrange]: ui === 'stroke-orange',
        [$style.button_tertiary]: ui === 'tertiary',
        [$style.button_block]: block,
      },
    ]"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ButtonSize, ButtonType, ButtonUI } from '~/types/common'

export default defineComponent({
  name: 'BaseButton',
  props: {
    tag: {
      type: String,
      default: 'button',
    },
    type: {
      type: String as PropType<ButtonType>,
      default: 'button',
      validator: (type: ButtonType) => ['button', 'submit'].includes(type),
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'sm',
      validator: (size: ButtonSize) => ['sm', 'md', 'xmd', 'lg'].includes(size),
    },
    ui: {
      type: String as PropType<ButtonUI>,
      default: 'primary',
      validator: (ui: ButtonUI) =>
        [
          'default',
          'primary',
          'secondary',
          'secondary-stroke',
          'stroke',
          'stroke-orange',
          'tertiary',
        ].includes(ui),
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedType() {
      return this.tag === 'button' ? this.type : null
    },
  },
})
</script>

<style lang="scss" module>
.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: normal;
  vertical-align: top;

  &_sm {
    height: 34px;
    padding: 2px 16px 0;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: -0.13px;
    border-radius: 4px;
  }

  &_md {
    height: 46px;
    padding: 2px 16px 0;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: -0.13px;
    border-radius: 6px;
  }

  &_xmd {
    height: 48px;
    padding: 2px 10px 0;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1.48px;
    border-radius: 4px;
  }

  &_lg {
    height: 53px;
    padding: 2px 16px 0;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: -0.18px;
    border-radius: 6px;
  }

  &_primary {
    color: #fff;
    background: var(--blue);
  }

  &_secondary {
    color: #fff;
    background: var(--success);
  }

  &_secondaryStroke {
    color: var(--success);
    background: none;
    border: 2px solid var(--success);
    border-radius: 2px;
  }

  &_stroke {
    color: var(--button-stroke-color);
    background: none;
    border: 1px solid var(--button-stroke-border);
    border-radius: 3px;
  }

  &_strokeOrange {
    color: #e2a688;
    background: none;
    border: 1px solid #dc9772;
  }

  &_default {
    color: var(--button-default-color);
    background: var(--button-default-background);
  }

  &_tertiary {
    color: var(--button-tertiary-color);
    background: var(--button-tertiary-background);
  }

  &_block {
    width: 100%;
  }

  @include disabled {
    cursor: not-allowed;
  }
}
</style>
