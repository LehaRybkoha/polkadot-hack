import { TypeRegistry } from '@polkadot/types/create'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { isTestChain } from '@polkadot/util'
import { readonly, ref, watch, reactive } from 'vue';
import { keyring as Keyring } from '@polkadot/ui-keyring'
import { useWeb3Store } from '../stores/stores.web3'
import { ContractPromise } from '@polkadot/api-contract';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
// import rpcMetadata from '@polkadot/metadata/Metadata/static';
import metadata from './metadata.json'
import { initCall } from './submit-result'

// The address is the actual on-chain address as ss58 or AccountId object.
const connectedSocket = 'ws://127.0.0.1:9944'

console.log(metadata, "MEEE");

const configSubmit = {
  api: null,
  accounts: null,
  contract: null
}

const CUSTOM_RPC_METHODS = {

}

const APP_NAME = "Brute force app"

const initialState = {
  // These are the states
  socket: connectedSocket,
  jsonrpc: { ...jsonrpc, ...CUSTOM_RPC_METHODS },
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null,
  currentAccount: null,
}

console.log(jsonrpc, "JSONRPC");



const registry = new TypeRegistry()

// const metadata =

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT_INIT':
      return { ...state, apiState: 'CONNECT_INIT' }
    case 'CONNECT':
      return { ...state, api: action.payload, apiState: 'CONNECTING' }
    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'READY' }
    case 'CONNECT_ERROR':
      return { ...state, apiState: 'ERROR', apiError: action.payload }
    case 'LOAD_KEYRING':
      return { ...state, keyringState: 'LOADING' }
    case 'SET_KEYRING':
      const web3Store = useWeb3Store();
      web3Store.$patch({ keyring: action.payload })
      return { ...state, keyring: action.payload, keyringState: 'READY' }
    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringState: 'ERROR' }
    case 'SET_CURRENT_ACCOUNT':
      return { ...state, currentAccount: action.payload }
    default:
      throw new Error(`Unknown type: ${action.type}`)
  }
}

const connectContract = async (api, metadata) => {
  const address = '5HXmx8hJyscGQvin678KqiUgNrxhyvxzVhFNzPyXK5MC4pd1'
  const contract = new ContractPromise(api, metadata, address);
  configSubmit.contract = contract

  // const from = "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM"

  // const tokens = await api.tx.balanceOf(from, { gasLimit: -1 }, from);

  // const data = await api.rpc.state.getMetadata()
  // console.log(data, "DAAATA");

  // console.log(contract.abi.messages, "MMM");
  // console.log(contract.query, "CONTRACT");
  // console.log(contract.tx, "TX CON")
  // console.log(api.tx, "TX API")

  // const tokens = await contract.query.getAllTokens();

  // console.log(tokens, "TOKENS");
}

const connect = async (state, dispatch) => {

  const { apiState, socket, jsonrpc } = state.value
  if (apiState) return
  dispatch({ type: 'CONNECT_INIT' })

  const provider = new WsProvider(socket)
  const _api = new ApiPromise({ provider, rpc: jsonrpc })

  const chainInfo = await _api.registry.getChainProperties()

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', async () => {
    dispatch({ type: 'CONNECT', payload: _api })
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    await _api.isReady
    configSubmit.api = _api
    dispatch({ type: 'CONNECT_SUCCESS' })
    connectContract(_api, metadata)
  })
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }))
  _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }))
}

const retrieveChainInfo = async api => {
  const [systemChain, systemChainType] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
  ])

  return {
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
  }
}

const handleNoExtension = () => {
  console.log("NO EXNTENSIONS INSTALLED");
  return;
}

const loadAccounts = (state, dispatch) => {
  const web3Store = useWeb3Store()
  const { api } = state.value
  dispatch({ type: 'LOAD_KEYRING' })

  const asyncLoadAccounts = async () => {
    try {
      const extensions = await web3Enable('my cool dapp');

      if (extensions.length === 0) {
        return handleNoExtension();
      }

      await web3Enable(APP_NAME)
      let allAccounts = await web3Accounts()
      console.log(allAccounts, "ALL ACCS");
      configSubmit.accounts = allAccounts

      allAccounts = allAccounts.map(({ address, meta }) => ({
        address,
        meta: { ...meta, name: `${meta.name} (${meta.source})` },
      }))



      web3Store.$patch({ polkadot_accounts: allAccounts })

      // Logics to check if the connecting chain is a dev chain, coming from polkadot-js Apps
      const { systemChain, systemChainType } = await retrieveChainInfo(api)

      const isDevelopment =
        systemChainType.isDevelopment ||
        systemChainType.isLocal ||
        isTestChain(systemChain)

      Keyring.loadAll({ isDevelopment }, allAccounts)

      dispatch({ type: 'SET_KEYRING', payload: Keyring })
    } catch (e) {
      console.error(e)
      dispatch({ type: 'KEYRING_ERROR' })
    }
  }
  asyncLoadAccounts()
}

const useReducer = (reducer, initialArg, init) => {
  const state = ref(init ? init(initialArg) : initialArg);
  const dispatch = (action) => {
    state.value = reducer(state.value, action);
  };

  return [readonly(state), dispatch];
}

const [state, dispatch] = useReducer(reducer, initialState)

const initSubstrate = async () => connect(state, dispatch)
const loadAccountsSubstrate = () => loadAccounts(state, dispatch)
const setCurrentAccount = (acct) => {
  const web3Store = useWeb3Store();
  dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: acct })
  web3Store.$patch({ currentAccount: acct })
}

export { configSubmit, state, dispatch, setCurrentAccount, initSubstrate, loadAccountsSubstrate }
