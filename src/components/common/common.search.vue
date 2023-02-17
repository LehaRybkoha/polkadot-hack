<script setup>
import { CommonInput } from ".";
import { IconSearch } from "../icons";

const updateValue = (value) => {
  console.log(value);
};
</script>

<template>
  <common-input
    class="search"
    placeholder="Collection, item or User"
    @input="updateValue"
  >
    <template #icon>
      <icon-wrapper class="search__icon" width="24" height="24">
        <icon-search />
      </icon-wrapper>
    </template>
  </common-input>
</template>

<style scoped lang="scss">
.search {
  &__icon {
    color: var(--main-text-color);
  }
}
</style>
