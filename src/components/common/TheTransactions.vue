<template>
  <div :class="$style.transactions">
    <div :class="$style.transactions__header">
      <div
        v-for="item in columns"
        :key="item.id"
        :class="$style.transactions__col"
      >
        {{ item.text }}
      </div>
    </div>
    <div :class="$style.transactions__body">
      <div
        v-for="row in rows"
        :key="row.txhash"
        :class="$style.transactions__row"
      >
        <div :class="$style.transactions__col" :data-label="columns[0].text">
          <div :class="$style.transactions__type">
            <div
              :class="[
                $style.transactions__figure,
                row.type == 'Buy Novo' || row.type == 'Sell Novo'
                  ? $style.transactions__figure_swap
                  : row.type === 'UnStake'
                  ? $style.transactions__figure_unstaking
                  : $style.transactions__figure_stake,
              ]"
            >
              <BaseIcon :name="row.icon" :class="$style.transactions__icon" />
            </div>
            {{ row.type }}
          </div>
        </div>
        <div :class="$style.transactions__col" :data-label="columns[1].text">
          <div :class="$style.transactions__info">
            <a :href="row.bsctxhash" target="_blank">{{
              'TxHash: ' + truncateString(row.txhash, 8)
            }}</a>
          </div>
        </div>
        <div :class="$style.transactions__col" :data-label="columns[2].text">
          <div :class="$style.transactions__return">
            {{ time_ago(parseInt(row.age) * 1000) }}
          </div>
        </div>
        <div :class="$style.transactions__col" :data-label="columns[3].text">
          {{ row.amount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseIcon from '../ui/BaseIcon.vue'
import { useStore } from '../../store'
import {
  pancakeRouterAddress,
  tokenContractAddress,
} from '../../constants/addresses'
import detectEthereumProvider from '@metamask/detect-provider'
import { TransactionItem } from '../../store/types'

export default defineComponent({
  name: 'TheTransactions',
  created() {
    detectEthereumProvider().then(async (provider: any) => {
      const bscScanAPIUrl =
        provider.chainId == 56 ? 'api.bscscan.com' : 'api-testnet.bscscan.com'
      const bscScanUrl =
        provider.chainId == 56
          ? 'https://bscscan.com/'
          : 'https://testnet.bscscan.com/'
      const tokenContract = tokenContractAddress
      const owner = this.getters.selectedAccount.value
      const pancakeRouterAddressOnNetwork = pancakeRouterAddress.toLowerCase()

      fetch(
        `https://${bscScanAPIUrl}/api?module=account&action=txlist&address=${owner}&page=1&offset=100&sort=desc&apikey=7BMPA4TJFJW6G9PBP21H9X2K6I7KBESXZR`
      ).then(async (response) => {
        const data = await response.json()
        if (!response.ok) {
          const error = (data && data.message) || response.statusText
          return Promise.reject(error)
        }

        let type = 'Unknown'
        let icon = ''
        data.result.map(async (d: any) => {
          type = 'Unknown'
          icon = ''
          if (
            d.to.toLowerCase() == pancakeRouterAddressOnNetwork.toLowerCase()
          ) {
            if (d.functionName.includes('swapExactETHForTokens')) {
              type = 'Buy Novo'
              icon = 'icon-swap'
            } else if (
              d.functionName.includes('swapExactTokensForTokens') ||
              d.functionName.includes('swapExactTokensForETH')
            ) {
              type = 'Sell Novo'
              icon = 'icon-swap'
            }
          } else if (
            d.to.toLowerCase() == tokenContract.toLowerCase() &&
            d.value == 0
          ) {
            type = d.functionName.includes('transfer') ? 'Transfer' : 'Approve'
            icon = 'icon-shield'
          }

          if (icon != '') {
            this.transactions.push({
              type: type,
              icon: icon,
              txhash: d.hash,
              age: d.timeStamp,
              amount: (d.value / 1e18).toFixed(3) + 'BNB',
              bsctxhash: bscScanUrl + 'tx/' + d.hash,
            })
          }
        })
      })
    })
  },
  data: () => ({
    transactions: Array<TransactionItem>(),
  }),
  computed: {
    rows() {
      return this.transactions
    },
  },
  methods: {
    truncateString(str: string, num: number) {
      if (str.length <= num * 2) {
        return str
      }

      // Return str truncated with '...' concatenated to the end of str.
      return str.slice(0, num) + '...' + str.slice(str.length - num, str.length)
    },
    time_ago(time: string | number | Date) {
      var inputTime = 0
      switch (typeof time) {
        case 'number':
          inputTime = time
          break
        case 'string':
          inputTime = +new Date(time)
          break
        case 'object':
          if (time.constructor === Date) inputTime = time.getTime()
          break
        default:
          inputTime = +new Date()
      }
      var time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
      ]
      var seconds = (+new Date() - inputTime) / 1000,
        token = 'ago',
        list_choice = 1

      if (seconds == 0) {
        return 'Just now'
      }
      if (seconds < 0) {
        seconds = Math.abs(seconds)
        token = 'from now'
        list_choice = 2
      }
      var i = 0,
        format
      while ((format = time_formats[i++]))
        if (seconds < format[0]) {
          if (typeof format[2] == 'string') return format[list_choice]
          else
            return (
              Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token
            )
        }
      return time
    },
  },
  setup() {
    const { getters } = useStore()

    const columns = [
      {
        id: 1,
        text: 'Type',
      },
      {
        id: 2,
        text: 'Info',
      },
      {
        id: 3,
        text: 'Age',
      },
      {
        id: 6,
        text: 'Amount',
      },
    ]

    return {
      getters,
      columns,
      // rows,
    }
  },
  components: { BaseIcon },
})
</script>

<style lang="scss" module>
@function transaction-width($units) {
  @return math.div($units, 1102) * 100%;
}

.transactions {
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
        width: transaction-width(200);
      }

      &:nth-child(2) {
        flex: 1 1 auto;
      }

      &:nth-child(3) {
        width: transaction-width(200);
      }

      &:nth-child(4) {
        width: 200px;
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
