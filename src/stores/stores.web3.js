import { defineStore } from 'pinia'

export const useWeb3Store = defineStore('web3', {
  state: () => ({
    polkadot_accounts: [],
    walletAddress: [],
    keyring: null,
    walletBalance: '0.00',
    chainId: localStorage.getItem('chainId'),
    currentAccount: null,
    theme: "primary"
  }),
})
