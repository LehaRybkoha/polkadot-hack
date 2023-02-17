<script setup>
import { CommonButton } from "~/components/common";

defineProps({
  item: Object,
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<template>
  <div class="about">
    <div class="container">
      <common-button @click="close" class="about__back">Back</common-button>
      <div class="about__wrapper">
        <div class="about__left">
          <img :src="item.img" alt="" class="about__img" />
        </div>
        <div class="about__right">
          <h1 class="about__title">{{ item.title }}</h1>
          <p class="about__desc">
            {{ item.description }}
          </p>
          <div class="about__blocks">
            <div class="block" v-if="item.author">
              <p class="block__title">Author</p>
              <p class="block__desc">
                {{ item.author }}
              </p>
            </div>
            <div class="block" v-if="item.typeTree">
              <p class="block__title">Type of tree</p>
              <p class="block__desc">
                {{ item.typeTree }}
              </p>
            </div>
            <div class="block" v-if="item.datePlaced">
              <p class="block__title">Date creation</p>
              <p class="block__desc">
                {{ item.datePlaced }}
              </p>
            </div>
            <div class="block" v-if="item.yearCreation">
              <p class="block__title">Year creation</p>
              <p class="block__desc">
                {{ item.yearCreation }}
              </p>
            </div>
            <div class="block" v-if="item.journalName">
              <p class="block__title">Journal Name</p>
              <p class="block__desc">
                {{ item.journalName }}
              </p>
            </div>
          </div>
          <common-button class="about__buy">Buy</common-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  margin-bottom: 30px;
  &__title {
    color: var(--main-text-color);
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 12px;
  }
  &__desc {
    color: var(--main-text-color);
  }
}
.about {
  &__buy {
    width: 100%;
    padding: 20px 0;
    margin-top: 30px;
  }
  &__back {
    margin-bottom: 10px;
  }
  &__left {
    margin-right: 50px;
    flex: none;
  }
  &__wrapper {
    display: flex;
  }
  &__img {
    width: 560px;
    height: 560px;
    object-fit: cover;
    border-radius: 10px;
  }
  &__title {
    color: var(--main-text-color);
    @include tg-h2-extra;
    margin-bottom: 20px;
  }
  &__desc {
    color: var(--main-text-color);
    @include tg-h6-extra;
    opacity: 0.6;
    margin-bottom: 30px;
  }
}
</style>
