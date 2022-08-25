import mitt from 'mitt'

type Events = {
  'confirmSwap:open': void
  'confirmSwap:close': void
  'connectWallet:open': void
  'connectWallet:close': void
  'alert:open': void
  'alert:close': void
}

export const emitter = mitt<Events>()
