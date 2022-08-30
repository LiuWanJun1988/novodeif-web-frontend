import { themeId } from '~/constants'
import { MetaMaskProvider } from '~/services/metamask'
import { StoreMethods, StoreState } from './types'
import { ethers } from 'ethers'
import {
  stakingContractAddress,
  ncosContractAddress,
} from '~/constants/addresses'
import { stakingContractABI, ncosContractABI } from '~/constants/contractABI'
import { WallConnectProvider } from '../services/walletconnect'

export default (state: StoreState): StoreMethods => {
  const methods: StoreMethods = {
    setProvider(_providerName: string) {
      try {
        switch (_providerName) {
          case 'walletconnect':
            state.provider = new WallConnectProvider()
            break
          default:
          case 'metamask':
            state.provider = new MetaMaskProvider()
            break
        }
      } catch (error) {
        console.log(error)
      }
    },
    getSigner() {
      return state.provider.getSigner()
    },
    getTokenContract() {
      return state.provider.getTokenContract()
    },
    getStakingContract() {
      return new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        state.provider.getSigner()
      )
    },
    getNcosContract() {
      return new ethers.Contract(
        ncosContractAddress,
        ncosContractABI,
        state.provider.getSigner()
      )
    },
    setTheme(theme) {
      state.theme = theme
      localStorage.setItem(themeId, theme)
    },
    setAccounts(accounts: string[]) {
      state.accounts = accounts
      methods.setBalance(accounts?.[0])
      methods.setNcosBalance(accounts?.[0])
      methods.setAllowance(accounts?.[0])
      methods.setStakeCount(accounts?.[0])
      methods.setStakeReward(accounts?.[0], 0)
    },
    async setBalance(account: string) {
      const balance = await this.getTokenContract().balanceOf(account)
      state.balance = Number(ethers.utils.formatUnits(balance, 9))
    },
    async setNcosBalance(account: string) {
      const balance = await this.getNcosContract().balanceOf(account)
      state.ncos = Number(ethers.utils.formatUnits(balance, 0))
    },
    async setAllowance(account: string) {
      const allowance = await this.getTokenContract().allowance(
        account,
        stakingContractAddress
      )
      state.allowance = Number(ethers.utils.formatUnits(allowance, 9))
    },
    async setCurrentStake(account: string, index: number) {
      const currentStake = await this.getStakingContract().stakeInfo(
        account,
        index
      )

      let cliff = await this.getStakingContract().cliff()
      cliff = Number(ethers.utils.formatUnits(cliff, 0))

      let leftSeconds =
        Number(ethers.utils.formatUnits(currentStake.startTimestamp, 0)) +
        cliff -
        Number(ethers.utils.formatUnits(currentStake.currentTimestamp, 0))
      leftSeconds = Number(ethers.utils.formatUnits(leftSeconds, 0))

      if (leftSeconds < 0) leftSeconds = 0

      const { longestTimeStaked } =
        await this.getStakingContract().calculateReward(account, index, 0)

      state.currentStake = {
        amount: Number(ethers.utils.formatUnits(currentStake.amount, 9)),
        lockedDays: currentStake.lockedDays,
        leftSeconds: leftSeconds,
        timeStaked:
          Number(ethers.utils.formatUnits(currentStake.currentTimestamp, 0)) -
          Number(ethers.utils.formatUnits(currentStake.startTimestamp, 0)),
        longestTimeStaked: Number(
          ethers.utils.formatUnits(longestTimeStaked, 0)
        ),
      }

      const vaultAvailableBalance =
        await this.getStakingContract().vaultAvailableBalance()
      state.vaultAvailableBalance = Number(
        ethers.utils.formatUnits(vaultAvailableBalance, 9)
      )
    },
    async setStakeCount(account: string) {
      const stakeCount = await this.getStakingContract().stakeCount(account)
      state.stakeCount = Number(stakeCount)
      state.currentStake = {
        amount: 0,
        lockedDays: 0,
        leftSeconds: 0,
        timeStaked: 0,
        longestTimeStaked: 0,
      }
      if (state.stakeCount > 0) {
        methods.setCurrentStake(account, 0)
      }
    },
    async setStakeReward(account: string, index: number) {
      const { reward } = await this.getStakingContract().calculateReward(
        account,
        index,
        0
      )
      state.stakeReward = Number(ethers.utils.formatUnits(reward, 9))
    },
    async authorize() {
      const accounts = await state.provider.getAccounts()
      methods.setAccounts(accounts)
    },
    async connect() {
      try {
        await state.provider.connect()
        await methods.authorize()
      } catch (error) {
        console.log(error)
      }
    },
    async disconnect() {
      try {
        await state.provider.disconnect()
        methods.setAccounts([])
      } catch (error) {
        console.log(error)
      }
    },
    setErrorMessage(error: string) {
      state.errorMessage = error
    },
    setAlertProperty(message: string, style: string) {
      state.alertProperty = { message, style }
    },
  }

  return methods
}
