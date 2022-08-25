<template>
  <div :class="$style.table">
    <div :class="$style.table__header">
      <div v-for="item in columns" :key="item.id" :class="$style.table__col">
        {{ item.text }}
      </div>
    </div>
    <div :class="$style.table__body">
      <div
        v-for="(row, key) of data"
        :key="row.wallet"
        :class="$style.table__row"
      >
        <div :class="$style.table__col" :data-label="columns[0].text">
          {{ key + 1 }}
        </div>
        <div :class="$style.table__col" :data-label="columns[1].text">
          {{ shortAddress(row.wallet) }}
        </div>
        <div :class="$style.table__col" :data-label="columns[2].text">
          {{ convertToNovo(row.timeStaked) }}
        </div>
        <div :class="$style.table__col" :data-label="columns[3].text">
          {{ row.novoScore.toFixed(3) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { convertToNovo } from '~/helpers/convertToCurrency'

export default defineComponent({
  name: 'BaseTable',
  props: {
    columns: {
      type: Array as PropType<Array<any>>,
      default: () => [{}],
    },
    data: {
      type: Array as PropType<Array<any>>,
      default: () => [{}],
    },
  },
  setup() {
    const shortAddress = (address: string) => {
      if (address) {
        return [address.slice(0, 5), address.slice(-4)].join('...')
      } else {
        return ''
      }
    }

    return { shortAddress, convertToNovo }
  },
})
</script>

<style lang="scss" module>
@function table-width($units) {
  @return math.div($units, 1102) * 100%;
}

.table {
  position: relative;
  color: var(--transactions-color);
  word-break: break-word;
  border-top: 1px solid var(--transactions-border);

  a:hover {
    color: #3467ff;
    text-decoration: underline;
  }

  p {
    margin-bottom: 8px;
  }

  &__header,
  &__row {
    @include media($from: sm) {
      display: flex;
      align-items: center;
    }
  }

  &__header {
    padding: 5px 0;
    font-weight: 700;
    font-size: 11px;
    line-height: 16px;
    letter-spacing: 1.32px;
    text-transform: uppercase;
    background: var(--transactions-header-background);
    border-bottom: 1px solid var(--transactions-border);

    @include media($to: sm) {
      display: none;
    }
  }

  &__row {
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 1.17px;

    @include media($to: lg) {
      font-size: 12px;
    }

    @include media($to: sm) {
      padding: 15px 0;
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--transactions-border);
    }
  }

  &__col {
    padding: 15px;

    @include media($from: sm) {
      &:nth-child(1) {
        width: table-width(200);
      }

      &:nth-child(2) {
        flex: 1 1 auto;
      }

      &:nth-child(3) {
        width: table-width(350);
      }

      &:nth-child(4) {
        width: table-width(200);
      }

      &:nth-child(1),
      &:nth-child(3),
      &:nth-child(4) {
        flex: 0 0 auto;
      }
    }

    @include media($to: sm) {
      position: relative;
      display: flex;
      align-items: center;
      padding: 6px 0;

      &::before {
        flex: 0 0 auto;
        width: 120px;
        font-weight: 700;
        text-transform: uppercase;
        content: attr(data-label);
      }

      &:nth-child(2) {
        align-items: flex-start;
      }
    }
  }

  &__type {
    display: flex;
    align-items: center;
  }

  &__figure {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1em;
    height: 1em;
    margin-right: 8px;
    font-size: 23px;
    border-radius: 50%;

    &_swap {
      color: #3467ff;
      background: rgb(52 103 255 / 0.22);
    }

    &_stake {
      color: #58bd7d;
      background: rgb(88 189 125 / 0.16);
    }

    &_unstaking {
      color: #d0021b;
      background: rgb(208 2 27 / 0.16);
    }
  }

  &__icon {
    font-size: percentage-of(15, 23);
  }

  &__line {
    height: 2px;
    margin: 0 20px;

    @include media($to: lg) {
      height: 1px;
      margin: 0 10px;
    }

    @include media($to: xs) {
      display: none;
    }
  }

  &__info {
    @include media($from: xs) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    @include media($to: xs) {
      span {
        display: block;
      }
    }
  }

  &__return {
    display: flex;
    align-items: center;
  }

  &__high {
    margin-left: 4px;
    color: #58bd7d;
    font-size: 6px;
  }
}
</style>
