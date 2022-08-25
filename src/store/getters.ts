import { computed } from 'vue'
import { StoreGetters, StoreState } from './types'

export default (state: StoreState): StoreGetters => {
  const getters: StoreGetters = {
    isAuthorized: computed(() => !!state.accounts.length),
    selectedAccount: computed(() => state.accounts?.[0] || ''),
    selectedAccountShort: computed(() => {
      if (getters.selectedAccount.value) {
        const account = getters.selectedAccount.value
        return [account.slice(0, 5), account.slice(-4)].join('...')
      } else {
        return ''
      }
    }),
    selectedBalance: computed(() => state.balance),
    selectedNcos: computed(() => state.ncos),
    selectedAllowance: computed(() => state.allowance),
    selectedCurrentStake: computed(() => state.currentStake),
    selectedStakeCount: computed(() => state.stakeCount),
    selectedStakeReward: computed(() => state.stakeReward),
    vaultAvailableBalance: computed(() => state.vaultAvailableBalance),
    errorMessage: computed(() => state.errorMessage),
    alertProperty: computed(() => state.alertProperty),
  }

  return getters
}
