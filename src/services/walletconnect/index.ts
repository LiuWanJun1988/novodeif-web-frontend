import { IProvider } from '../interfaces/IProvider'

import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers, providers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import { tokenContractAddress } from '../../constants/addresses'
import { tokenContractABI } from '../../constants/contractABI'
import walletconnect from 'walletconnect'

let walletConnectSigner: ethers.providers.JsonRpcSigner =
  {} as ethers.providers.JsonRpcSigner

let walletConnecTokenContract: ethers.Contract = {} as ethers.Contract

const wc = (window as any).WalletConnectSDK //hack for production load of walletConnect from CDN
  ? new (window as any).WalletConnectSDK.default()
  : new walletconnect()

export class WallConnectProvider implements IProvider {
  private provider: WalletConnectProvider = {} as WalletConnectProvider
  private web3provider: Web3Provider = {} as Web3Provider

  getWeb3ProviderInstance(): ethers.providers.Web3Provider {
    return this.web3provider
  }

  public isInitialized = () => {
    return true
  }

  public install = () => {
    console.log('install')
  }

  public connect = async () => {
    await wc.connect({ chainId: 56 })

    this.provider = wc.getWeb3Provider({
      infuraId: '6e7b4272293a404587ab9633c2232f8a',
      chainId: 56,
      rpc: {
        56: 'https://bsc-dataseed1.ninicoin.io',
      },
    }) as unknown as WalletConnectProvider

    await this.provider.enable()

    this.web3provider = new providers.Web3Provider(this.provider)
    walletConnectSigner = this.web3provider.getSigner()
    walletConnecTokenContract = new ethers.Contract(
      tokenContractAddress,
      tokenContractABI,
      walletConnectSigner
    )
  }

  public getSigner(): providers.JsonRpcSigner {
    return walletConnectSigner
  }

  public getTokenContract(): ethers.Contract {
    return walletConnecTokenContract
  }

  public disconnect = () => this.provider.disconnect()

  public getAccounts = () => this.provider.request({ method: 'eth_accounts' })

  public getBalance = (
    account: string,
    tag: 'latest' | 'earliest' | 'pending'
  ) => {
    return this.provider.request({
      method: 'eth_getBalance',
      params: [account, tag],
    })
  }

  public onChange = (callback: (accounts: string[]) => void) =>
    this.web3provider?.on('accountsChanged', (accounts: string[]) => {
      callback(accounts)
    })
}
