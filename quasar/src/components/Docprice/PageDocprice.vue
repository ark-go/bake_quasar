<template>
  <q-page
    class="flex flex-center ark-backgound1"
    style="min-width: 360px"
    :style-fn="panelFnHeight"
  >
    <doc-price
      :pageMaxHeight="pageMaxHeight"
      :heightRabZone="heightRabZone"
      title="Прейскурант"
      subTitle="Документы об изменении цен"
    ></doc-price>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import DocPrice from "components/Docprice/DocPrice.vue";
import { useDocPrice } from "stores/storeDocPrice.js";
export default defineComponent({
  name: "PageDocprice",
  components: {
    DocPrice,
  },

  setup(props, { emit }) {
    const docPrice = useDocPrice();
    const heightRabZone = ref(0);
    const pageMaxHeight = ref();
    function panelFnHeight(offset, height2) {
      heightRabZone.value = height2 - offset - 60;
      let height = `calc(100vh - ${offset}px)`;
      let heightChild = `calc(100vh - ${offset}px - 60px)`;
      pageMaxHeight.value = { minHeight: heightChild, maxHeight: heightChild };
      return { minHeight: height, maxHeight: height };
    }
    return {
      docPrice,
      heightRabZone,
      panelFnHeight,
      pageMaxHeight,
    };
  },
});
</script>
<style lang="scss" scoped></style>
