import BN from 'bn.js';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';
import { reactive, watch } from 'vue';

let nextId = 1
export let txs = reactive({})
export let txId = reactive(null)

const useWeight = (estimation) => {
  let limit = estimation ?? new BN(100);
  let mode = 'estimation'
  let errorMsg = ''
  let isValid = false
  let text = limit.toString()

  function setText() {
    if (mode === 'estimation' && estimation && !estimation.eq(limit) && !estimation.isZero()) {
      text = estimation.toString()
      limit = estimation
    }
  }
  setText()

  return {
    isValid,
    limit,
    mode,
    errorMsg,
    text,
    setText,
  };
}

export function isEmptyObj(value) {
  return JSON.stringify(value) === '{}';
}

export async function process(id, api) {
  console.log('PROCESS');

  const tx = txs[id];
  if (!tx) throw new Error(`No tx with id: ${id} is queued `);

  const { extrinsic, accountId, isValid, onSuccess, onError } = tx;
  txs = { ...txs, [id]: { ...tx, status: 'processing' } }
  const injector = api.rpc.system.isDevelopment ? undefined : await web3FromAddress(accountId);
  const account = api.rpc.system.isDevelopment ? keyring.getPair(accountId) : accountId;

  try {
    const unsub = await extrinsic.signAndSend(
      account,
      { signer: injector?.signer || undefined },
      async result => {
        if (result.isInBlock || result.isFinalized) {
          const events = {};

          result.events.forEach(record => {
            const { event } = record;
            const key = `${event.section}:${event.method}`;
            if (!events[key]) {
              events[key] = 1;
            } else {
              events[key]++;
            }
          });

          if (!isValid(result)) {
            txs = { ...txs, [id]: { ...tx, status: 'error', events } }

            let message = 'Transaction failed';

            if (result.dispatchError?.isModule) {
              const decoded = api?.registry.findMetaError(result.dispatchError.asModule);
              message = `${decoded?.section.toUpperCase()}.${decoded?.method}: ${decoded?.docs}`;
            }

            onError && onError(result);

            throw new Error(message);
          }

          onSuccess && (await onSuccess(result));

          txs = { ...txs, [id]: { ...tx, status: 'success', events } }

          unsub();

          nextId++;
        }
      }
    );
  } catch (error) {
    txs = { ...txs, [id]: { ...tx, status: 'error' } };
    console.error(error);
  }
}

function queue(options) {
  console.log("QUEUE");
  txs = {
    ...txs,
    [nextId]: {
      ...options,
      status: 'queued',
      events: {},
    },
  };

  console.log(txs, "QQ");

  return nextId;
}

const getGasLimit = (switchOn,
  refTimeLimit,
  proofSizeLimit,
  registry) => {
  return switchOn
    ? registry.createType('WeightV2', {
      refTime: refTimeLimit,
      proofSize: proofSizeLimit,
    })
    : null;
}

const decodeStorageDeposit = (
  storageDeposit
) => {
  if (storageDeposit.isCharge) {
    return { value: storageDeposit.asCharge, type: 'charge' };
  } else if (storageDeposit.isRefund) {
    return { value: storageDeposit.asRefund, type: 'refund' };
  }
  return {
    type: 'empty',
  };
}

const getStorageDepositLimit = (
  switchOn,
  userInput,
  registry,
  dryRunValue = null
) => {
  return null
}

let nextResultId = 1
const callResults = []

const onSuccess = ({ events, contractEvents, dispatchError }) => {
  callResults.push([
    {
      id: nextResultId,
      message,
      time: Date.now(),
      contractEvents,
      events,
      error: dispatchError?.isModule
        ? api.registry.findMetaError(dispatchError.asModule)
        : undefined,
    },
  ]);

  nextResultId += 1
};

const transformUserInput = (
  registry,
  messageArgs,
  values = null
) => {
  return messageArgs.map(({ name, type: { type } }) => {
    const value = values ? values[name] : null;

    if (type === 'Balance') {
      return registry.createType('Balance', value);
    }

    return value || null;
  });
}

function isErr(o) {
  return typeof o === 'object' && o !== null && 'Err' in o;
}

function isOk(o) {
  return typeof o === 'object' && o !== null && 'Ok' in o;
}

function getReturnTypeName(type) {
  return type?.lookupName || type?.type || '';
}

function getDecodedOutput(
  { result },
  { returnType },
  registry
) {
  console.log(result, 'ressss');
  let decodedOutput = '';
  let isError = true;
  if (result.isOk) {
    const flags = result.asOk.flags.toHuman();
    isError = flags.includes('Revert');
    const returnTypeName = getReturnTypeName(returnType);
    const r = returnType
      ? registry.createTypeUnsafe(returnTypeName, [result.asOk.data]).toHuman()
      : '()';
    const o = isOk(r) ? r.Ok : isErr(r) ? r.Err : r;

    const errorText = isErr(o)
      ? typeof o.Err === 'object'
        ? JSON.stringify(o.Err, null, 2)
        : o.Err?.toString() ?? 'Error'
      : o !== 'Ok'
        ? o?.toString() || 'Error'
        : 'Error';

    const okText = isOk(r)
      ? typeof o === 'object'
        ? JSON.stringify(o, null, '\t')
        : o?.toString() ?? '()'
      : JSON.stringify(o, null, '\t') ?? '()';

    decodedOutput = isError ? errorText : okText;
  }
  return {
    decodedOutput,
    isError,
  };
}


export const call = async (api, contract, accounts) => {
  const newId = { current: null }
  const accId = accounts[0].address
  console.log(accounts, "AAA");
  // console.log(accounts[0].address, "ADDRESS");
  const message = contract.abi.messages[3]
  console.log(message, "MESSAGE");

  const BN_ZERO = new BN(0);

  // let storageDepositMax;

  // await api.derive.balances
  //   .account(accounts[0].address)
  //     .then(({ freeBalance }) => storageDepositMax = freeBalance)
  //   .catch(console.error);

  const params = [
    accId,
    contract.address.toString(),
    api.registry.createType('Balance', BN_ZERO),
    getGasLimit(false, BN_ZERO, BN_ZERO, api.registry),
    getStorageDepositLimit(false, BN_ZERO, api.registry),
    '',
  ]

  const outcome = await api.call.contractsApi.call(...params);

  const { gasRequired: gasRequiredV2, gasConsumed, storageDeposit: storageDepositV2, debugMessage, result } = outcome
  console.log(result.isOk, "IS OKAY RESULT", debugMessage);

  const { decodedOutput, isError } = getDecodedOutput({ result, debugMessage }, message, contract.abi.registry);

  console.log(decodedOutput, "OUTPUT");

  console.log("OUTCOME", outcome);
  const refTime = useWeight(outcome?.gasRequired.refTime.toBn());
  console.log("REFTIME", refTime);
  const { storageDeposit, gasRequired } = outcome;
  const isActive = false
  const userInput = BN_ZERO
  const predictedStorageDeposit = decodeStorageDeposit(storageDeposit);
  const proofSize = useWeight(outcome?.gasRequired.proofSize.toBn());
  const isCustom = refTime.mode === 'custom' || proofSize.mode === 'custom';

  console.log('REQUERED GAS', isCustom, refTime.limit, proofSize.limit, api.registry);

  console.log(getGasLimit(isCustom, refTime.limit, proofSize.limit, api.registry), "GAS LIM");

  const options = {
    gasLimit: getGasLimit(isCustom, refTime.limit, proofSize.limit, api.registry) ?? gasRequired,
    storageDepositLimit: getStorageDepositLimit(
      isActive,
      userInput,
      api.registry,
      predictedStorageDeposit
    ),
    value: message.isPayable ? (params[2]) : undefined,
  };

  const isValid = (result) => !result.isError && !result.dispatchError;

  const extrinsic = contract.tx[message.method](
    options,
    ...transformUserInput(contract.abi.registry, message.args, [])
  );

  newId.current = queue({
    extrinsic,
    accountId: accId,
    onSuccess,
    isValid,
  });
  txId = newId.current
}

function dismiss(id) {
  const newTxs = { ...txs };
  delete newTxs[id];
  txs = newTxs
}

const state = {
  txs,
  dismiss,
  process,
  queue,
};

export const initCall = (api, contract, accounts) => {
  return () => call(api, contract, accounts)
}
