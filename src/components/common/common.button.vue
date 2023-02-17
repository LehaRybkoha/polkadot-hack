<script setup>
defineProps({
  variant: {
    type: String,
    default: () => "primary",
  },
});
</script>

<template>
  <button class="button" :class="variant">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.button {
  border: 1px solid var(--user-button);
  border-radius: 10px;
  padding: 10px 20px;
  background: var(--user-button);
  color: #ffffff;
  transition: opacity 0.4s ease;
  &.outline {
    background: transparent;
    color: var(--user-button);
  }
  &:hover {
    opacity: 0.7;
  }
}
</style>
