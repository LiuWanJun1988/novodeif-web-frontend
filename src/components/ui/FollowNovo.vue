<template>
  <div v-if="isVisible" :class="$style.follow">
    <BaseIcon name="icon-follow-novo" :class="$style.follow__icon" />
    <div :class="$style.follow__content">
      <h2 :class="$style.follow__title">
        Want the most up to date news and announcements?
      </h2>
      <p :class="$style.follow__text">
        We annouce things on Twitter and Discord first so make sure to give us a
        follow and join our communities.
      </p>
    </div>
    <BaseButton
      ui="primary"
      size="sm"
      :class="$style.follow__button"
      @click="followTwitter"
    >
      Follow Novo
    </BaseButton>
    <button type="button" :class="$style.follow__close" @click="hideMe">
      <BaseIcon name="icon-close" :class="$style.follow__closeIcon" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseIcon from './BaseIcon.vue'
import BaseButton from './BaseButton.vue'

export default defineComponent({
  name: 'FollowNovo',
  components: { BaseIcon, BaseButton },
  methods: {
    followTwitter() {
      window.open('https://twitter.com/novodefi', '_blank')
    },
  },
  setup() {
    const isVisible = ref(true)
    const hideMe = () => {
      isVisible.value = false
    }

    return {
      isVisible,
      hideMe,
    }
  },
})
</script>

<style lang="scss" module>
.follow {
  position: relative;
  padding: 30px 33px 36px;
  background-image: var(--follow-background);

  @include media($from: sm) {
    display: flex;
    align-items: flex-start;
  }

  @include media($to: sm) {
    padding: 30px 24px;
    text-align: center;
  }

  &__icon {
    font-size: 77px;

    @include media($from: sm) {
      flex: 0 0 auto;
    }

    @include media($to: sm) {
      margin-bottom: 18px;
    }
  }

  &__button {
    min-width: 120px;
    margin-top: 18px;

    @include media($from: sm) {
      flex: 0 0 auto;
    }
  }

  &__content {
    @include media($from: sm) {
      flex: 1 1 auto;
      padding: 6px 32px 8px;
    }
  }

  &__title,
  &__text {
    max-width: 550px;
  }

  &__title {
    margin-bottom: 4px;
    font-size: 16px;
    line-height: 17px;
    letter-spacing: -0.17px;
  }

  &__text {
    color: var(--follow-text);
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.02px;
  }

  &__close {
    position: absolute;
    top: 0;
    right: 20px;
    width: 40px;
    height: 40px;
    color: inherit;
    background: none;
  }

  &__closeIcon {
    font-size: 14px;
  }
}
</style>
