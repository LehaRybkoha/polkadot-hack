<script setup>
import { AppHeader } from "~/components/app";
import { ElementCardList, ElementPreview } from "./elements";

import { ApiPromise, WsProvider } from "@polkadot/api";
import { onMounted, ref } from "vue";
import { createPerformance, createScience, createTrees } from "~/utils/factory";
import { PageAbout } from "./pages";

const trees = [
  createTrees(
    "On Ural's mountains",
    "Feel",
    "Serbian spruce",
    "https://images.squarespace-cdn.com/content/v1/5811566d20099e23814644fd/1630077975266-WEDN8L4F1WKUVZZU56VA/DA-Norway-spruce-planting-norway-tree.jpg",
    "This NFT represents a real life tree planted in",
    "01.05.2022"
  ),
  createTrees(
    "In deep forest",
    "Oleg",
    "Maple tree",
    "https://vsegda-pomnim.com/uploads/posts/2022-04/1649564259_11-vsegda-pomnim-com-p-molodoi-klen-foto-15.jpg",
    "This NFT represents how I saved a little tree",
    "01.03.2022"
  ),
  createTrees(
    "Along the road",
    "Alex",
    "birch tree",
    "https://vsegda-pomnim.com/uploads/posts/2022-04/1649556027_22-vsegda-pomnim-com-p-bereza-odna-foto-24.jpg",
    "This NFT is about a tree, which I helped to survive",
    "07.08.2021"
  ),
  createTrees(
    "On the hills",
    "Tatyana",
    "Cottonwood tree",
    "https://glav-dacha.ru/wp-content/uploads/2021/01/piramidalnyy-topol-1.jpg",
    "Thats how I planted a tree in a Siberia forest",
    "01.02.2020"
  ),
];

const science = [
  createScience(
    "Structural biology",
    "Nan Wang",
    "USA",
    2000,
    "Boston post",
    "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-022-01241-x/MediaObjects/41589_2022_1241_Fig1_HTML.png",
    "Structural biology is the study of the molecular structure and dynamics of biological macromolecules, particularly proteins and nucleic acids, and how alterations in their structures affect their function. Structural biology incorporates the principles of molecular biology, biochemistry and biophysics.",
    {
      photos: [
        "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-022-01241-x/MediaObjects/41589_2022_1241_Fig1_HTML.png",
        "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-023-01255-z/MediaObjects/41589_2023_1255_Fig1_HTML.png",
      ],
    }
  ),
  createScience(
    "A novel biologically active xylaphenoside from the endophytic fungus Xylaria CGMCC No.5410",
    "Nan Wang",
    "USA",
    2000,
    "Bostan post",
    "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-022-01241-x/MediaObjects/41589_2022_1241_Fig1_HTML.png",
    "Developmental biology is the field of biology that studies the processes by which multicellular organisms grow and develop, controlled by their genes. Knowledge of normal developmental processes can aid in the understanding of developmental abnormalities and other conditions such as cancer.",
    {
      photos: [
        "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-022-01241-x/MediaObjects/41589_2022_1241_Fig1_HTML.png",
        "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41594-022-00916-2/MediaObjects/41594_2022_916_Fig1_HTML.png",
      ],
    }
  ),
  createScience(
    "Structural biology",
    "Nan Wang",
    "USA",
    2000,
    "Boston post",
    "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-022-01241-x/MediaObjects/41589_2022_1241_Fig1_HTML.png",
    "Structural biology is the study of the molecular structure and dynamics of biological macromolecules, particularly proteins and nucleic acids, and how alterations in their structures affect their function. Structural biology incorporates the principles of molecular biology, biochemistry and biophysics.",
    {
      photos: [
        "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-022-01241-x/MediaObjects/41589_2022_1241_Fig1_HTML.png",
        "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-023-01255-z/MediaObjects/41589_2023_1255_Fig1_HTML.png",
      ],
    }
  ),
  createScience(
    "A novel biologically active xylaphenoside from the endophytic fungus Xylaria CGMCC No.5410",
    "Nan Wang",
    "USA",
    2000,
    "Bostan post",
    "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-022-01241-x/MediaObjects/41589_2022_1241_Fig1_HTML.png",
    "Developmental biology is the field of biology that studies the processes by which multicellular organisms grow and develop, controlled by their genes. Knowledge of normal developmental processes can aid in the understanding of developmental abnormalities and other conditions such as cancer.",
    {
      photos: [
        "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41589-022-01241-x/MediaObjects/41589_2022_1241_Fig1_HTML.png",
        "https://media.springernature.com/w75h75/springer-static/image/art%3A10.1038%2Fs41594-022-00916-2/MediaObjects/41594_2022_916_Fig1_HTML.png",
      ],
    }
  ),
];

const perfomances = [
  createPerformance(
    "FireWork",
    "Neo gate",
    "https://ksonline.ru/wp-content/uploads/2022/09/beautiful-colorful-firework-display-at-night-for-celebrate.jpg"
  ),
  createPerformance(
    "Help for homeless",
    "Orio codjama",
    "https://mcdn.tvzvezda.ru/storage/news_other_images/2020/04/05/7f9bf96436b74d3ca4d60afb28c9a1d3.jpg"
  ),
  createPerformance(
    "Help animals",
    "Vlad",
    "https://kutenev.ru/wp-content/uploads/2020/11/P1000258-1024x769.jpg"
  ),
  createPerformance(
    "FireWork",
    "Neo gate",
    "https://ksonline.ru/wp-content/uploads/2022/09/beautiful-colorful-firework-display-at-night-for-celebrate.jpg"
  ),
  createPerformance(
    "Help for homeless",
    "Orio codjama",
    "https://mcdn.tvzvezda.ru/storage/news_other_images/2020/04/05/7f9bf96436b74d3ca4d60afb28c9a1d3.jpg"
  ),
];

const chosenItem = ref(null);

const changeItem = (item) => {
  chosenItem.value = item;
};

const closePage = () => {
  chosenItem.value = null;
};
</script>

<template>
  <div class="home">
    <main class="content" v-if="!chosenItem">
      <element-card-list />
      <element-preview @change-item="changeItem" :items="trees" title="Trees" />
      <element-preview
        @change-item="changeItem"
        :items="science"
        title="Science"
      />
      <element-preview
        @change-item="changeItem"
        :items="perfomances"
        title="Perfomances"
      />
    </main>
    <main v-else class="content">
      <page-about @close="closePage" :item="chosenItem" />
    </main>
  </div>
</template>

<style scoped lang="scss">
</style>
