import { ethers, providers } from 'ethers'
import { ComputedRef } from 'vue'
import { Theme } from '~/types/common'
import { IProvider } from '../services/interfaces/IProvider'

export interface StoreState {
  theme: Theme
  accounts: string[]
  balance: number
  ncos: number
  allowance: number
  currentStake: any
  stakeCount: number
  stakeReward: number
  vaultAvailableBalance: number
  errorMessage: string
  alertProperty: any
  provider: IProvider
}

export interface StoreGetters {
  isAuthorized: ComputedRef<boolean>
  selectedAccount: ComputedRef<string>
  selectedAccountShort: ComputedRef<string>
  selectedBalance: ComputedRef<number>
  selectedNcos: ComputedRef<number>
  selectedAllowance: ComputedRef<number>
  selectedCurrentStake: ComputedRef<any>
  selectedStakeCount: ComputedRef<number>
  selectedStakeReward: ComputedRef<number>
  vaultAvailableBalance: ComputedRef<number>
  errorMessage: ComputedRef<string>
  alertProperty: ComputedRef<any>
}

export interface StoreMethods {
  setTheme(theme: Theme): void
  setAccounts(accounts: string[]): void
  setBalance(account: string): void
  setNcosBalance(account: string): void
  setAllowance(account: string): void
  setCurrentStake(account: string, index: number): void
  setStakeCount(account: string): void
  setStakeReward(account: string, index: number): void
  setProvider(providerName: string): void
  connect(): Promise<void>
  disconnect(): Promise<void>
  authorize(): Promise<void>
  getStakingContract(): ethers.Contract
  getTokenContract(): ethers.Contract
  getNcosContract(): ethers.Contract
  getSigner(): providers.JsonRpcSigner
  setErrorMessage(error: string): void
  setAlertProperty(message: string, style: string): void
}

export type TransactionItem = {
  type: string
  icon: string
  txhash: string
  age: string
  amount: string
  bsctxhash: string
}