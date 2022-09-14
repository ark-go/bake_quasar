<style lang="scss" scoped>
.menu-card {
  height: 100px;
  width: 170px;
  border-radius: 20px;
  margin: 4px;
  // padding: 3px;
  background-color: rgb(242, 243, 242);
  cursor: pointer;
  border-style: outset;
  border-color: silver;
  // border-width: 3px;
  overflow: hidden;
}
.menu-card-section {
  height: 100%;
  border-radius: 20px;
  font-weight: bold;
  color: indigo;
  font-size: 1.1rem;

  overflow-wrap: anywhere;
  background-image: url("/images/metall1.jpg");
}
</style>
<template>
  <q-card v-if="!header && !hiddenMenuCard" class="menu-card">
    <!-- <q-img src="/images/1.jpg">
      <div class="absolute-bottom text-subtitle2 text-center">Title</div>
    </q-img> -->
    <q-card-section
      v-ripple
      class="flex q-px-none flex-center menu-card-section shadow-10"
      @click="router.push({ path: link })"
    >
      <span v-html="title"> </span>
    </q-card-section>
    <!-- <div class="absolute-bottom text-center">{{ title }}</div>
    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subitle2"> ку </q-card-section>
      </div>
    </q-slide-transition> -->
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "MenuCard",
  components: {},
  props: ["title", "link", "header", "hiddenMenuCard"],
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
<style lang="scss" scoped>
// .ark {
//   background-image: url("/bg/pattern-vintage-small.svg");
// }
</style>
