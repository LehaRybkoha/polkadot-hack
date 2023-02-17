<script setup>
import { CommonSearch, CommonButton } from "../common";
import {
  state,
  dispatch,
  initSubstrate,
  loadAccountsSubstrate,
  setCurrentAccount,
  configSubmit,
} from "~/core/substrate-setup";
import { initCall, txs, txId, process } from "~/core/submit-result";
import { computed, onMounted, ref, watch } from "vue";
import { useWeb3Store } from "~/stores/stores.web3";
import { keyring } from "@polkadot/ui-keyring";
import { Switch } from "@headlessui/vue";
import { useStore } from "~/stores/stores.main";

const web3Store = useWeb3Store();

let keyringLoadAll = ref(false);

let call = null;

watch(
  () => state.value,
  async () => {
    const { apiState, keyringState, currentAccount } = state.value;
    console.log(apiState, keyringState, "STATES");
    if (apiState === "READY" && !keyringState && !keyringLoadAll.value) {
      keyringLoadAll.value = true;
      loadAccountsSubstrate();
    }

    if (keyringState === "READY" && state.value.keyring) {
      const keyringOptions = keyring.getPairs().map((account) => ({
        key: account.address,
        value: account.address,
        text: account.meta.name.toUpperCase(),
        icon: "user",
      }));

      const initialAddress =
        keyringOptions.length > 0 ? keyringOptions[0].value : "";

      if (!currentAccount && initialAddress.length > 0) {
        setCurrentAccount(keyring.getPair(initialAddress));
      }
      // console.log(keyringOptions);
      // console.log(
      //   JSON.parse(JSON.stringify(currentAccount)),
      //   currentAccount?.address,
      //   "CURRENT ACCOUNT"
      // );
      const { api, accounts, contract } = configSubmit;
      call = initCall(api, contract, accounts);
      await call();
      async function processTx() {
        txs[txId]?.status === "queued" && (await process(txId, api));
      }
      processTx().catch((e) => console.error(e));
    }
  }
);

// watch(
//   () => txs,
//   () => {
//     console.log("CHANGE TXS");
//   },
//   { deep: true }
// );

// useEffect(() => {
//     async function processTx() {
//       txs[txId]?.status === 'queued' && (await process(txId));
//     }
//     processTx().catch(e => console.error(e));
//   }, [process, txId, txs]);

const onChange = (addr) => {
  setCurrentAccount(keyring.getPair(addr));
};

const enabled = ref(false);
const store = useStore();

const computedStore = computed(() => store.theme);

const computedTheme = computed(() => {
  if (computedStore.value === "primary") {
    return "Make light";
  }
  return "Make Dark";
});

const changeTheme = () => {
  if (computedStore.value === "primary") {
    store.$patch({
      theme: "light",
    });
  } else {
    store.$patch({
      theme: "primary",
    });
  }
};

onMounted(() => {
  initSubstrate();
  console.log(computedStore.value, "VAl");
});
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header__wrapper">
        <div class="header__left">
          <a href="/" class="header__link"
            ><h1 class="header__title">EventSpace</h1></a
          >
          <common-search class="header__search" />
        </div>
        <div class="header__right">
          <nav class="nav">
            <ul class="nav__list">
              <li class="nav__item">
                <a href="" class="nav__link">Trees</a>
                <span class="nav__line"></span>
              </li>
              <li class="nav__item">
                <a href="" class="nav__link">Science</a>
                <span class="nav__line"></span>
              </li>
              <li class="nav__item">
                <a href="" class="nav__link">Performances</a>
                <span class="nav__line"></span>
              </li>
            </ul>
          </nav>
          <button
            @click="changeTheme"
            class="header__theme"
            :class="{ dark: computedStore === 'primary' }"
          >
            {{ computedTheme }}
          </button>
          <common-button class="header__button">Connect Wallet</common-button>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  background-color: var(--main-color);
  &__theme {
    padding: 20px 30px;
    background: #000000;
    border-radius: 10px;
    color: #ffffff;
    margin-right: 20px;
    flex: none;
    &.dark {
      color: #000000;
      background: #ffffff;
    }
  }
  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
  }
  &__left,
  &__right {
    display: flex;
    align-items: center;
    width: 100%;
  }
  &__right {
    justify-content: space-between;
  }
  &__title {
    color: var(--main-text-color);
    @include tg-h2-extra;
    flex: none;
  }
  &__search {
    margin: 0 50px 0 50px;
    width: 100%;
  }
  &__link {
    white-space: nowrap;
  }
}

.nav {
  &__list {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  &__item {
    margin-right: 20px;
    position: relative;
  }
  &__line {
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--line-color);
    width: 0;
    transition: width ease-in-out 0.2s;
  }
  &__link {
    text-decoration: none;
    color: var(--main-text-color);
    transition: opacity ease 0.4s;
    &:hover {
      opacity: 0.4;
      & + .nav__line {
        width: 100%;
      }
    }
  }
}
</style>
