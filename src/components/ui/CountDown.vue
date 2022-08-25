<template>
  {{ timer }}
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

export default defineComponent({
  name: 'CountDown',
  props: {
    seconds: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const counter = ref(props.seconds)

    const timer = computed(() => {
      const days = counter.value / 60 / 60 / 24
      const hours = (days % 1) * 24
      const minutes = (hours % 1) * 60
      const seconds = (minutes % 1) * 60

      const fixedDays = Math.floor(days)
      const fixedHours = Math.floor(hours)
      const fixedMinutes = Math.floor(minutes)
      const fixedSeconds = Math.round(seconds)

      const dayWord = fixedDays > 1 ? 'days' : 'day'

      return [
        fixedDays && `${fixedDays} ${dayWord}`,
        fixedHours && `${fixedHours} hr`,
        fixedMinutes && `${fixedMinutes} min`,
        fixedSeconds && `${fixedSeconds} sec`,
      ]
        .filter(Boolean)
        .join(' ')
    })

    let timerId: number | undefined
    const tick = () => {
      timerId = setTimeout(() => {
        counter.value = Math.max(0, counter.value - 1)
        tick()
      }, 1000) as unknown as number
    }

    watch(
      () => props.seconds,
      (seconds) => (counter.value = seconds)
    )

    onMounted(tick)
    onBeforeUnmount(() => {
      clearTimeout(timerId)
    })

    return {
      timer,
    }
  },
})
</script>
