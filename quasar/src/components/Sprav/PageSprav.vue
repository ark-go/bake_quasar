<template>
  <q-page
    :style-fn="panelFnHeight"
    class="flex flex-center"
    style="min-width: 360px"
  >
    <sprav :pageMaxHeight="pageMaxHeight"></sprav>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import Sprav from "components/Sprav/Sprav.vue";

export default defineComponent({
  name: "PageSprav",
  components: {
    Sprav,
  },
  setup() {
    const pageMaxHeight = ref();
    function panelFnHeight(offset, height2) {
      let height = `calc(100vh - ${offset}px)`;
      let heightChild = `calc(100vh - ${offset}px - 60px)`;
      pageMaxHeight.value = { minHeight: heightChild, maxHeight: heightChild };
      console.log("sprav pageMaxHeight ", offset, pageMaxHeight.value);
      return { minHeight: height, maxHeight: height };
    }
    return {
      panelFnHeight,
      pageMaxHeight,
    };
  },
});
</script>
