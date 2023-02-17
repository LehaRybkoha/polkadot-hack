<script setup>
import { ElementCard } from ".";
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper";
import "swiper/scss";

// const items = ref([
//   {
//     title: "test card",
//     img: "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
//     author: "test author",
//     type: "test type",
//   },
//   {
//     title: "test card",
//     img: "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
//     author: "test author",
//     type: "test type",
//   },
//   {
//     title: "test card",
//     img: "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
//     author: "test author",
//     type: "test type",
//   },
//   {
//     title: "test card",
//     img: "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
//     author: "test author",
//     type: "test type",
//   },
//   {
//     title: "test card",
//     img: "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
//     author: "test author",
//     type: "test type",
//   },
// ]);

const modules = [Autoplay];

const onSwiper = (swiper) => {
  // console.log(swiper);
};
const onSlideChange = () => {
  // console.log("slide change");
};

defineProps({
  title: String,
  catalogItems: Array,
  items: Array,
});

const emit = defineEmits(["change-item"]);

const changeItem = (item) => {
  emit("change-item", item);
};
</script>

<template>
  <div class="preview">
    <header class="preview__header">
      <div class="preview__left">
        <h1 class="preview__title">{{ title }}</h1>
        <p class="preview__desc">101 items</p>
      </div>
      <div class="preview__right">
        <button class="preview__button">View All</button>
      </div>
    </header>
    <div class="preview__content">
      <swiper
        :loop="true"
        :grabCursor="true"
        :slides-per-view="4"
        :space-between="10"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: true,
        }"
        :breakpoints="{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1150: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1600: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
          2000: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }"
        :modules="modules"
      >
        <swiper-slide v-for="(item, idx) of items" :key="idx">
          <element-card
            @change-item="changeItem"
            class="preview__item"
            :item="item"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview {
  margin-top: 72px;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 40px;
  }
  &__title {
    @include create-font(34px, 700, 42px);
    color: var(--main-text-color);
  }
  &__desc {
    @include create-font(14px, 400, 24px);
    color: var(--main-text-color);
    opacity: 0.6;
    margin-top: 10px;
  }
  &__button {
    @include create-font(14px, 700, 24px);
    color: var(--user-button);
  }
}
</style>
