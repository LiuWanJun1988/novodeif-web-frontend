<template>
  <component :is="name" ref="icon" :class="$style.icon" :style="style" />
</template>

<script lang="ts">
import {
  Component,
  defineComponent,
  reactive,
  computed,
  onMounted,
  ref,
} from 'vue'

const components = Object.entries(import.meta.globEager('../svg/*.vue')).reduce(
  (acc: { [k: string]: Component }, [key, definition]) => {
    const fileName = key.split('/').pop() as string
    const componentName = fileName.split('.').slice(0, -1).pop() as string

    acc[componentName] = definition.default

    return acc
  },
  {}
)

export default defineComponent({
  name: 'BaseIcon',
  components,
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  setup() {
    const sizes = reactive({
      width: 16,
      height: 16,
    })

    const style = computed(() => ({
      width: `${sizes.width / sizes.height}em`,
    }))

    const icon = ref()

    onMounted(() => {
      const el = icon.value.$el

      if (!el) return

      const [width, height] = el.getAttribute('viewBox').split(' ').slice(-2)
      sizes.width = width
      sizes.height = height
    })

    return {
      style,
      icon,
    }
  },
})
</script>

<style lang="scss" module>
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: top;
}
</style>
