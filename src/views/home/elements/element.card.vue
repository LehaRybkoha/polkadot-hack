<script setup>
const props = defineProps({
  item: Object,
});

const emit = defineEmits(["change-item"]);

const changeItem = () => {
  emit("changeItem", props.item);
};
</script>

<template>
  <div class="card" @click="changeItem">
    <div class="card__top">
      <img
        class="card__img"
        :class="{ 'card__img-only': !item.title }"
        :src="item.img"
        alt=""
      />
    </div>
    <div class="card__bottom" v-if="item.title">
      <div class="card__block" v-if="item.title">
        <h3 class="card__title">Title</h3>
        <p class="card__value">{{ item.title }}</p>
      </div>
      <div class="card__block" v-if="item.author">
        <h3 class="card__title">Author</h3>
        <p class="card__value">{{ item.author }}</p>
      </div>
      <div class="card__block" v-if="item.area">
        <h3 class="card__title">Area</h3>
        <p class="card__value">{{ item.area }}</p>
      </div>
      <div class="card__block" v-if="item.yearCreation">
        <h3 class="card__title">Year of creation</h3>
        <p class="card__value">{{ item.yearCreation }}</p>
      </div>
      <div class="card__block" v-if="item.journalName">
        <h3 class="card__title">Journal Name</h3>
        <p class="card__value">{{ item.journalName }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  flex: none;
  border-radius: 10px;
  overflow: hidden;
  width: 350px;

  &__top {
    height: 350px;
  }
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    &-only {
      border-radius: 10px;
    }
  }
  &__bottom {
    padding: 24px;
    background: var(--main-color);
  }
  &__title {
    @include create-font(12px, 400, 16px);
    color: var(--main-text-color);
    opacity: 0.6;
    margin-bottom: 4px;
  }
  &__value {
    @include create-font(16px, 600, 24px);
    color: var(--main-text-color);
  }
  &__block {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 10px;
  }
}
</style>
