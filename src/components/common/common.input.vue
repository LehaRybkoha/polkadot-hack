<script setup>
import { useSlots } from "vue";

const slots = useSlots();

const props = defineProps({
  value: String,
  type: {
    type: String,
    default: () => "text",
  },
  placeholder: String,
});

const emit = defineEmits(["input"]);

const handleChange = (e) => {
  emit("input", e.target.value);
};
</script>

<template>
  <label class="label">
    <span class="input__icon"><slot name="icon" /></span>
    <input
      class="input"
      :class="{
        'input--icon': slots.icon,
      }"
      :placeholder="placeholder"
      :type="type"
      :value="value"
      @change="handleChange"
    />
  </label>
</template>

<style scoped lang="scss">
.label {
  position: relative;
}
.input {
  border-radius: 5px;
  padding: 8px 20px 8px 20px;
  width: 100%;
  background-color: var(--input-color);
  color: var(--main-text-color);
  &--icon {
    padding-left: 40px;
  }
  &__icon {
    position: absolute;
    z-index: 10;
    height: 100%;
    display: flex;
    align-items: center;
    left: 10px;
  }
}
</style>
