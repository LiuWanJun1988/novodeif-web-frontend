import { ethers, providers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'

export interface IProvider {
  isInitialized: () => void
  install: () => void
  connect: () => Promise<void>
  disconnect: () => void
  getAccounts: () => Promise<string[]>
  getBalance: (
    account: string,
    tag: 'latest' | 'earliest' | 'pending'
  ) => Promise<string[]>
  onChange: (callback: (accounts: string[]) => void) => void
  getSigner(): providers.JsonRpcSigner
  getTokenContract(): ethers.Contract
  getWeb3ProviderInstance(): Web3Provider
}
