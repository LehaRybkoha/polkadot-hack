<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper";
import { ElementCard } from ".";
import "swiper/scss";

const items = [
  {
    img: "https://glav-dacha.ru/wp-content/uploads/2021/01/piramidalnyy-topol-1.jpg",
  },
  {
    img: "https://vsegda-pomnim.com/uploads/posts/2022-04/1649556027_22-vsegda-pomnim-com-p-bereza-odna-foto-24.jpg",
  },
  {
    img: "https://vsegda-pomnim.com/uploads/posts/2022-04/1649564259_11-vsegda-pomnim-com-p-molodoi-klen-foto-15.jpg",
  },
  {
    img: "https://images.squarespace-cdn.com/content/v1/5811566d20099e23814644fd/1630077975266-WEDN8L4F1WKUVZZU56VA/DA-Norway-spruce-planting-norway-tree.jpg",
  },
];

const modules = [Autoplay];

const onSwiper = (swiper) => {
  // console.log(swiper);
};
const onSlideChange = () => {
  // console.log("slide change");
};
</script>

<template>
  <div class="cards">
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
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(item, idx) of items" :key="idx">
        <element-card class="cards__item" :item="item" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.cards {
  display: flex;
  overflow-x: scroll;
  border-radius: 10px;
  @include hide-scrollbar;
}
</style>
