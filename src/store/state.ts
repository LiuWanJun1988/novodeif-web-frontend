import { reactive } from 'vue'
import { Theme } from '~/types/common'
import { MetaMask, MetaMaskProvider } from '../services/metamask'
import { StoreState } from './types'

export default (): StoreState =>
  reactive({
    theme: Theme.LIGHT,
    accounts: [],
    balance: 0,
    allowance: 0,
    currentStake: {
      amount: 0,
      lockedDays: 0,
      startTimestamp: 0,
    },
    provider: new MetaMaskProvider(),
    stakeCount: 0,
    stakeReward: 0,
    vaultAvailableBalance: 0,
    errorMessage: '',
    alertProperty: {
      message: 'Alert Message',
      style: 'pending',
    },
  })
