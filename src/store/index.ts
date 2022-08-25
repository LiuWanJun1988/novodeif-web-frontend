import getters from './getters'
import methods from './methods'
import state from './state'

const storeState = state()
const storeGetters = getters(storeState)
const storeMethods = methods(storeState, storeGetters)

export function useStore() {
  return {
    state: storeState,
    getters: storeGetters,
    methods: storeMethods,
  }
}
