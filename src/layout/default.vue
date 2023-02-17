<script setup>
import { computed, ref } from "vue";
import { AppSidebar, AppHeader } from "~/components/app";
import { useStore } from "~/stores/stores.main";

const open = ref(true);

const store = useStore();

const computedTheme = computed(() => store.theme);

const computedClass = computed(() => {
  if (computedTheme.value === "primary") {
    return "theme-primary";
  }
  return "theme-light";
});
</script>

<template>
  <div class="layout" :class="[{ close: open }, computedClass]">
    <app-header class="header" />
    <app-sidebar class="sidebar" />
    <div class="content">
      <slot />
    </div>
    <app-footer class="footer" />
  </div>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 250px 4fr;
  grid-template-areas:
    "sidebar header"
    "sidebar content"
    "footer footer";
  transition: all ease 0.3s;
}

.close {
  grid-template-columns: 0 4fr;
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.footer {
  grid-area: footer;
}

.content {
  grid-area: content;
  min-height: 100vh;
  height: 0;
  overflow: auto;
  background-color: var(--main-bg-color);
  padding: 50px;
  padding-bottom: 200px;
}
</style>
