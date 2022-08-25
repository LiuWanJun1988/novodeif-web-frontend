import MetaMaskOnboarding from '@metamask/onboarding'
import { ethers, providers } from 'ethers'
import { IProvider } from '../interfaces/IProvider'
import { Web3Provider } from '@ethersproject/providers'
import {
  stakingContractAddress,
  tokenContractAddress,
} from '../../constants/addresses'
import {
  stakingContractABI,
  tokenContractABI,
} from '../../constants/contractABI'

const url = new URL(window.location.href)
const forwarderOrigin =
  url.hostname === 'localhost' ? 'http://localhost:9010' : undefined

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean
      request<R = void>(options: {
        method: string
        params?: string[]
      }): Promise<R>
      on<C>(event: string, callback: C): void
    }
  }
}

const provider =
  window.ethereum && new ethers.providers.Web3Provider(window.ethereum)
const signer = provider?.getSigner()
const tokenContract = new ethers.Contract(
  tokenContractAddress,
  tokenContractABI,
  signer
)
export class MetaMaskProvider implements IProvider {
  private onboarding = new MetaMaskOnboarding({ forwarderOrigin })
  private provider = window.ethereum

  // private get provider(): typeof window.ethereum {
  //   return window.ethereum
  // }

  //   export const provider = new ethers.providers.Web3Provider(window.ethereum)
  // export const signer = provider?.getSigner()
  // export const tokenContract = new ethers.Contract(
  //   tokenContractAddress,
  //   tokenContractABI,
  //   signer
  // )
  // export const stakingContract = new ethers.Contract(
  //   stakingContractAddress,
  //   stakingContractABI,
  //   signer
  // )

  public isInitialized = () => {
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  getWeb3ProviderInstance(): ethers.providers.Web3Provider {
    return provider
  }

  public install = () => {
    this.onboarding.startOnboarding()
  }

  public getSigner(): providers.JsonRpcSigner {
    // return this.web3Provider?.getSigner()
    return signer
  }
  public getTokenContract(): ethers.Contract {
    return tokenContract
  }

  public connect = () =>
    this.provider
      ?.request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        if (this.provider.chainId != '0x38') {
          try {
            this.provider?.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x38' }],
            })
            console.log('You have switched to the right network')
          } catch (switchError: any) {
            // The network has not been added to MetaMask
            if (switchError.code === 4902) {
              console.log('Please add the BSC network to MetaMask')
            }
            console.log('Cannot switch to the network')
          }
        }
      })
      .catch((err) => console.log(err))

  public disconnect = () =>
    this.provider?.request({
      method: 'eth_requestAccounts',
      params: [{ eth_accounts: {} } as any],
    })

  public getAccounts = () =>
    this.provider?.request<string[]>({ method: 'eth_accounts' })

  public getBalance = (
    account: string,
    tag: 'latest' | 'earliest' | 'pending'
  ) =>
    this.provider?.request<string[]>({
      method: 'eth_getBalance',
      params: [account, tag],
    })

  public onChange = (callback: (accounts: string[]) => void) =>
    this.provider?.on<(accounts: string[]) => void>('accountsChanged', callback)
}
